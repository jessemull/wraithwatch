import { shouldChangeProperty } from '../entity-utils';

describe('Entity Utils', () => {
  describe('shouldChangeProperty', () => {
    it('should return true when frequency is 1', () => {
      jest.spyOn(Math, 'random').mockReturnValue(0.5);

      const result = shouldChangeProperty(1);
      expect(result).toBe(true);
    });

    it('should return false when frequency is 0', () => {
      jest.spyOn(Math, 'random').mockReturnValue(0.5);

      const result = shouldChangeProperty(0);
      expect(result).toBe(false);
    });

    it('should return true when random is less than frequency', () => {
      jest.spyOn(Math, 'random').mockReturnValue(0.3);

      const result = shouldChangeProperty(0.5);
      expect(result).toBe(true);
    });

    it('should return false when random is greater than frequency', () => {
      jest.spyOn(Math, 'random').mockReturnValue(0.7);

      const result = shouldChangeProperty(0.5);
      expect(result).toBe(false);
    });

    it('should return false when random equals frequency', () => {
      jest.spyOn(Math, 'random').mockReturnValue(0.5);

      const result = shouldChangeProperty(0.5);
      expect(result).toBe(false);
    });

    it('should handle edge cases', () => {
      jest.spyOn(Math, 'random').mockReturnValue(0.001);
      expect(shouldChangeProperty(0.002)).toBe(true);

      jest.spyOn(Math, 'random').mockReturnValue(0.999);
      expect(shouldChangeProperty(0.998)).toBe(false);
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });
  });
});
