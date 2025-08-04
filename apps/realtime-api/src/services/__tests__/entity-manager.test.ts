import { EntityManager } from '../../services/entity-manager';
import { shouldChangeProperty } from '../../utils/entity-utils';
import { transformDatabaseDataToEntities } from '../../utils/entity-transformer';
import { NodeCacheEntityCache } from '../entity-cache';
import { Entity, EntityListMessage, EntityType } from '../../types/entity';
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
    });

    it('sends connection status message', () => {
      manager.sendConnectionStatus(client as unknown as WebSocketConnection);
      const msg = JSON.parse(client.socket.send.mock.calls[0][0]);
      expect(msg.type).toBe('connection_status');
    });
  });

  describe('generateEntityUpdates', () => {
    beforeEach(() => {
      manager['isInitialized'] = true;
      entityCache.keys.mockReturnValue(['e1']);
      entityCache.get.mockReturnValue(dummyEntity);
    });

    it('skips updates if not initialized', () => {
      manager['isInitialized'] = false;
      manager.generateEntityUpdates();
      expect(wsManager.broadcast).not.toHaveBeenCalled();
    });

    it('processes entity updates when initialized', () => {
      (shouldChangeProperty as jest.Mock).mockReturnValue(true);
      propertyGen.getAllowedPropertiesForEntityType.mockReturnValue([
        'cpu_usage',
      ]);
      propertyGen.getPropertyChangeFrequency.mockReturnValue(0.5);
      propertyGen.generatePropertyValue.mockReturnValue(75);

      manager.generateEntityUpdates();

      expect(wsManager.broadcast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'entity_update',
        })
      );
    });

    it('creates missing properties for entities', () => {
      const entityWithoutProperty = {
        ...dummyEntity,
        properties: {},
      };
      entityCache.get.mockReturnValue(entityWithoutProperty);
      propertyGen.getAllowedPropertiesForEntityType.mockReturnValue([
        'accuracy',
      ]);
      propertyGen.generatePropertyValue.mockReturnValue(0.8);

      manager.generateEntityUpdates();

      expect(entityCache.set).toHaveBeenCalledWith(
        entityWithoutProperty.id,
        expect.objectContaining({
          properties: expect.objectContaining({
            accuracy: expect.any(Object),
          }),
        })
      );
    });

    it('skips properties not allowed for entity type', () => {
      propertyGen.getAllowedPropertiesForEntityType.mockReturnValue([
        'cpu_usage',
      ]);
      dummyEntity.properties['invalid_property'] = {
        name: 'invalid_property',
        currentValue: 'test',
        lastChanged: new Date().toISOString(),
        history: [],
      };
      (shouldChangeProperty as jest.Mock).mockReturnValue(false);

      manager.generateEntityUpdates();

      expect(wsManager.broadcast).not.toHaveBeenCalled();
    });

    it('maintains property history length limit', () => {
      const entityWithLongHistory = {
        ...dummyEntity,
        properties: {
          cpu_usage: {
            name: 'cpu_usage',
            currentValue: 50,
            lastChanged: new Date().toISOString(),
            history: Array.from(
              { length: MAX_PROPERTY_HISTORY_LENGTH + 1 },
              (_, i) => ({
                timestamp: new Date().toISOString(),
                oldValue: i,
                newValue: i + 1,
              })
            ),
          },
        },
      };
      entityCache.get.mockReturnValue(entityWithLongHistory);
      propertyGen.getAllowedPropertiesForEntityType.mockReturnValue([
        'cpu_usage',
      ]);
      propertyGen.getPropertyChangeFrequency.mockReturnValue(1);
      propertyGen.generatePropertyValue.mockReturnValue(75);
      (shouldChangeProperty as jest.Mock).mockReturnValue(true);

      manager.generateEntityUpdates();

      expect(entityCache.set).toHaveBeenCalledWith(
        entityWithLongHistory.id,
        expect.objectContaining({
          properties: expect.objectContaining({
            cpu_usage: expect.objectContaining({
              history: expect.arrayContaining([
                expect.objectContaining({
                  oldValue: 50,
                  newValue: 75,
                }),
              ]),
            }),
          }),
        })
      );
    });

    it('handles property update with string values', () => {
      const entityWithStringProperty = {
        ...dummyEntity,
        properties: {
          status: {
            name: 'status',
            currentValue: 'online',
            lastChanged: new Date().toISOString(),
            history: [],
          },
        },
      };
      entityCache.get.mockReturnValue(entityWithStringProperty);
      propertyGen.getAllowedPropertiesForEntityType.mockReturnValue(['status']);
      propertyGen.getPropertyChangeFrequency.mockReturnValue(1);
      propertyGen.generatePropertyValue.mockReturnValue('offline');
      (shouldChangeProperty as jest.Mock).mockReturnValue(true);

      manager.generateEntityUpdates();

      expect(wsManager.broadcast).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: expect.objectContaining({
            oldValue: 'online',
            newValue: 'offline',
          }),
        })
      );
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
