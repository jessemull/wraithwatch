import { EntityManager } from '../../services/entity-manager';
import { shouldChangeProperty } from '../../utils/entity-utils';
import { transformDatabaseDataToEntities } from '../../utils/entity-transformer';
import { NodeCacheEntityCache } from '../entity-cache';
import {
  Entity,
  EntityUpdateMessage,
  EntityListMessage,
  EntityType,
} from '../../types/entity';
import { MAX_PROPERTY_HISTORY_LENGTH } from '../../constants';
import { WebSocketConnection } from '../../types';

jest.mock('../../utils/entity-utils');
jest.mock('../../utils/entity-transformer');
jest.mock('../property-value-generator');
jest.mock('../entity-cache');
jest.mock('../../types/services');

describe('EntityManager', () => {
  let wsManager: any;
  let dbService: any;
  let propertyGen: any;
  let entityCache: any;
  let manager: EntityManager;

  const dummyEntity: Entity = {
    id: 'e1',
    name: 'TestEntity',
    type: 'Agent' as EntityType,
    properties: {
      cpu_usage: {
        name: 'cpu_usage',
        currentValue: 50,
        lastChanged: new Date().toISOString(),
        history: [],
      },
    },
    lastSeen: '',
    changesToday: 0,
  };

  beforeEach(() => {
    wsManager = { broadcast: jest.fn() };
    dbService = { getAllData: jest.fn() };
    propertyGen = {
      getAllowedPropertiesForEntityType: jest.fn(),
      getPropertyChangeFrequency: jest.fn(),
      generatePropertyValue: jest.fn(),
    };
    entityCache = { set: jest.fn(), get: jest.fn(), keys: jest.fn() };

    (NodeCacheEntityCache as jest.Mock).mockReturnValue(entityCache);

    manager = new EntityManager(wsManager, dbService, entityCache, propertyGen);
  });

  describe('initializeFromDatabase', () => {
    it('loads and caches entities from DB', async () => {
      dbService.getAllData.mockResolvedValue([{ foo: 'bar' }]);
      (transformDatabaseDataToEntities as jest.Mock).mockReturnValue([
        dummyEntity,
      ]);
      await manager.initializeFromDatabase();

      expect(entityCache.set).toHaveBeenCalledWith(dummyEntity.id, dummyEntity);
    });

    it('throws if DB fails', async () => {
      dbService.getAllData.mockRejectedValue(new Error('dbfail'));
      await expect(manager.initializeFromDatabase()).rejects.toThrow('dbfail');
    });
  });

  describe('getEntities', () => {
    it('returns all cached entities', () => {
      entityCache.keys.mockReturnValue(['e1', 'e2']);
      entityCache.get.mockImplementation((id: string) =>
        id === 'e1' ? dummyEntity : undefined
      );

      const result = manager.getEntities();
      expect(result).toEqual([dummyEntity]);
    });
  });

  describe('sendEntityList & sendConnectionStatus', () => {
    const client = { socket: { send: jest.fn() } };

    beforeEach(() => {
      client.socket.send.mockClear();
    });

    it('sends entity list message', () => {
      jest.spyOn(manager, 'getEntities').mockReturnValue([dummyEntity]);
      manager.sendEntityList(client as unknown as WebSocketConnection);
      const msg: EntityListMessage = JSON.parse(
        client.socket.send.mock.calls[0][0]
      );
      expect(msg.type).toBe('entity_list');
      expect(msg.payload.entities).toEqual([dummyEntity]);
    });

    it('sends connection status', () => {
      manager.sendConnectionStatus(client as unknown as WebSocketConnection);
      const msg = JSON.parse(client.socket.send.mock.calls[0][0]);
      expect(msg.type).toBe('connection_status');
      expect(msg.payload.status).toBe('connected');
    });
  });

  describe('generateEntityUpdates', () => {
    beforeEach(async () => {
      manager['isInitialized'] = true;
      entityCache.keys.mockReturnValue(['e1']);
      entityCache.get.mockReturnValue(dummyEntity);
      propertyGen.getAllowedPropertiesForEntityType.mockReturnValue([
        'cpu_usage',
        'accuracy',
      ]);
    });

    it('skips if not initialized', () => {
      manager['isInitialized'] = false;
      manager.generateEntityUpdates();
      expect(wsManager.broadcast).not.toHaveBeenCalled();
    });

    it('no update if shouldChangeProperty false', () => {
      (shouldChangeProperty as jest.Mock).mockReturnValue(false);
      manager.generateEntityUpdates();
      expect(wsManager.broadcast).not.toHaveBeenCalled();
    });

    it('performs update and broadcasts and limits history', () => {
      (shouldChangeProperty as jest.Mock).mockReturnValue(true);
      propertyGen.getPropertyChangeFrequency.mockReturnValue(0.3);
      propertyGen.generatePropertyValue.mockReturnValue(75);

      dummyEntity.changesToday = 0;
      dummyEntity.properties.cpu_usage.history = Array(
        MAX_PROPERTY_HISTORY_LENGTH
      ).fill({
        timestamp: 'ts',
        oldValue: 1,
        newValue: 2,
      });
      manager.generateEntityUpdates();

      expect(propertyGen.generatePropertyValue).toHaveBeenCalled();
      expect(wsManager.broadcast).toHaveBeenCalledWith(
        expect.objectContaining<EntityUpdateMessage>({
          type: 'entity_update',
          payload: expect.objectContaining({
            entityId: dummyEntity.id,
            property: 'cpu_usage',
            oldValue: 50,
            newValue: 75,
          }),
        })
      );
      expect(dummyEntity.properties.cpu_usage.history.length).toBe(
        MAX_PROPERTY_HISTORY_LENGTH
      );
      expect(entityCache.set).toHaveBeenCalledWith(dummyEntity.id, dummyEntity);
    });

    it('adds missing property if allowed but absent', () => {
      const e2 = { ...dummyEntity, properties: { accuracy: {} } };
      entityCache.get.mockReturnValueOnce(e2);
      (shouldChangeProperty as jest.Mock).mockReturnValue(false);
      propertyGen.generatePropertyValue.mockReturnValue(20);
      manager.generateEntityUpdates();
      expect(e2.properties.accuracy).toBeDefined();
      expect(entityCache.set).not.toHaveBeenCalled();
    });
  });

  describe('startUpdateGeneration', () => {
    jest.useFakeTimers();
    it('calls generateEntityUpdates on interval', () => {
      const spy = jest.spyOn(manager, 'generateEntityUpdates');
      manager.startUpdateGeneration(100);
      jest.advanceTimersByTime(300);
      expect(spy).toHaveBeenCalledTimes(3);
    });
  });
});
