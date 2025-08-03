import {
  isEntityListMessage,
  isEntityUpdateMessage,
  isConnectionStatusMessage,
} from '../websocket';
import { WEBSOCKET_MESSAGE_TYPES } from '../../constants';
describe('WebSocket Utility Functions', () => {
  describe('isEntityListMessage', () => {
    it('returns true for valid entity list message', () => {
      const message = {
        type: WEBSOCKET_MESSAGE_TYPES.ENTITY_LIST,
        payload: {
          entities: [
            {
              id: '1',
              type: 'System',
              lastSeen: '2023-01-01T10:00:00Z',
              changesToday: 0,
            },
          ],
        },
      };
      expect(isEntityListMessage(message)).toBe(true);
    });
    it('returns false for message with wrong type', () => {
      const message = {
        type: WEBSOCKET_MESSAGE_TYPES.ENTITY_UPDATE,
        payload: {
          entities: [],
        },
      };
      expect(isEntityListMessage(message)).toBe(false);
    });
    it('returns false for message without payload', () => {
      const message = {
        type: WEBSOCKET_MESSAGE_TYPES.ENTITY_LIST,
      };
      expect(isEntityListMessage(message)).toBe(false);
    });
    it('returns false for message with null payload', () => {
      const message = {
        type: WEBSOCKET_MESSAGE_TYPES.ENTITY_LIST,
        payload: null,
      };
      expect(isEntityListMessage(message)).toBe(false);
    });
    it('returns false for message without entities in payload', () => {
      const message = {
        type: WEBSOCKET_MESSAGE_TYPES.ENTITY_LIST,
        payload: {
          otherField: 'value',
        },
      };
      expect(isEntityListMessage(message)).toBe(false);
    });
  });
  describe('isEntityUpdateMessage', () => {
    it('returns true for valid entity update message', () => {
      const message = {
        type: WEBSOCKET_MESSAGE_TYPES.ENTITY_UPDATE,
        payload: {
          entityId: 'test-entity',
          propertyName: 'cpu_usage',
          newValue: 75,
          oldValue: 50,
        },
      };
      expect(isEntityUpdateMessage(message)).toBe(true);
    });
    it('returns false for message with wrong type', () => {
      const message = {
        type: WEBSOCKET_MESSAGE_TYPES.ENTITY_LIST,
        payload: {
          entityId: 'test-entity',
        },
      };
      expect(isEntityUpdateMessage(message)).toBe(false);
    });
    it('returns false for message without payload', () => {
      const message = {
        type: WEBSOCKET_MESSAGE_TYPES.ENTITY_UPDATE,
      };
      expect(isEntityUpdateMessage(message)).toBe(false);
    });
    it('returns false for message with null payload', () => {
      const message = {
        type: WEBSOCKET_MESSAGE_TYPES.ENTITY_UPDATE,
        payload: null,
      };
      expect(isEntityUpdateMessage(message)).toBe(false);
    });
    it('returns false for message without entityId in payload', () => {
      const message = {
        type: WEBSOCKET_MESSAGE_TYPES.ENTITY_UPDATE,
        payload: {
          otherField: 'value',
        },
      };
      expect(isEntityUpdateMessage(message)).toBe(false);
    });
  });
  describe('isConnectionStatusMessage', () => {
    it('returns true for valid connection status message', () => {
      const message = {
        type: WEBSOCKET_MESSAGE_TYPES.CONNECTION_STATUS,
        payload: {
          status: 'connected',
        },
      };
      expect(isConnectionStatusMessage(message)).toBe(true);
    });
    it('returns false for message with wrong type', () => {
      const message = {
        type: WEBSOCKET_MESSAGE_TYPES.ENTITY_LIST,
        payload: {
          status: 'connected',
        },
      };
      expect(isConnectionStatusMessage(message)).toBe(false);
    });
    it('returns false for message without payload', () => {
      const message = {
        type: WEBSOCKET_MESSAGE_TYPES.CONNECTION_STATUS,
      };
      expect(isConnectionStatusMessage(message)).toBe(false);
    });
    it('returns false for message with null payload', () => {
      const message = {
        type: WEBSOCKET_MESSAGE_TYPES.CONNECTION_STATUS,
        payload: null,
      };
      expect(isConnectionStatusMessage(message)).toBe(false);
    });
    it('returns false for message without status in payload', () => {
      const message = {
        type: WEBSOCKET_MESSAGE_TYPES.CONNECTION_STATUS,
        payload: {
          otherField: 'value',
        },
      };
      expect(isConnectionStatusMessage(message)).toBe(false);
    });
  });
});
