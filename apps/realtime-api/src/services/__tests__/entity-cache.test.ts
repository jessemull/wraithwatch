import { NodeCacheEntityCache } from '../entity-cache';

describe('NodeCacheEntityCache', () => {
  let mockCache: {
    set: jest.Mock;
    get: jest.Mock;
    keys: jest.Mock;
  };
  let cacheWrapper: NodeCacheEntityCache;

  beforeEach(() => {
    mockCache = {
      set: jest.fn(),
      get: jest.fn(),
      keys: jest.fn(),
    };
    cacheWrapper = new NodeCacheEntityCache(mockCache);
  });

  describe('set', () => {
    it('should delegate set to the underlying cache', () => {
      mockCache.set.mockReturnValue(true);
      const result = cacheWrapper.set('foo', { bar: 123 });
      expect(mockCache.set).toHaveBeenCalledWith('foo', { bar: 123 });
      expect(result).toBe(true);
    });
  });

  describe('get', () => {
    it('should return a value of the correct generic type', () => {
      mockCache.get.mockReturnValue({ bar: 123 });
      const result = cacheWrapper.get<{ bar: number }>('foo');
      expect(mockCache.get).toHaveBeenCalledWith('foo');
      expect(result).toEqual({ bar: 123 });
    });

    it('should return undefined if key not found', () => {
      mockCache.get.mockReturnValue(undefined);
      const result = cacheWrapper.get<{ bar: number }>('missing');
      expect(result).toBeUndefined();
    });
  });

  describe('keys', () => {
    it('should return an array of keys from the cache', () => {
      mockCache.keys.mockReturnValue(['a', 'b', 'c']);
      const result = cacheWrapper.keys();
      expect(mockCache.keys).toHaveBeenCalled();
      expect(result).toEqual(['a', 'b', 'c']);
    });
  });
});
