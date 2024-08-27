const NodeCache = require('node-cache');
const { getFromCache, setInCache, hasCache, checkCache } = require('../src/node-cache');

jest.mock('node-cache', () => {
  const mCache = {
    get: jest.fn(),
    set: jest.fn(),
    has: jest.fn()
  };
  return jest.fn(() => mCache);
});

describe('Cache Functions', () => {
  let cache;

  beforeEach(() => {
    cache = new NodeCache();
    
    cache.get.mockClear();
    cache.set.mockClear();
    cache.has.mockClear();
  });

  describe('getFromCache', () => {
    it('should return the value from the cache', () => {
      cache.get.mockReturnValue('India');
      const result = getFromCache('1.0.0.27');
      expect(result).toBe('India');
      expect(cache.get).toHaveBeenCalledWith('1.0.0.27');
    });

    it('should return undefined if the value is not in the cache', () => {
      cache.get.mockReturnValue(undefined);
      const result = getFromCache('1.0.0.27');
      expect(result).toBeUndefined();
      expect(cache.get).toHaveBeenCalledWith('1.0.0.27');
    });
  });

  describe('hasCache', () => {
    it('should return true if the value is in the cache', () => {
      cache.has.mockReturnValue(true);
      const result = hasCache('1.0.0.27');
      expect(result).toBe(true);
      expect(cache.has).toHaveBeenCalledWith('1.0.0.27');
    });

    it('should return false if the value is not in the cache', () => {
      cache.has.mockReturnValue(false);
      const result = hasCache('1.0.0.27');
      expect(result).toBe(false);
      expect(cache.has).toHaveBeenCalledWith('1.0.0.27');
    });
  });

  describe('setInCache', () => {
    it('should set the value in the cache', () => {
      setInCache('1.0.0.27', 'India');
      expect(cache.set).toHaveBeenCalledWith('1.0.0.27', 'India');
    });
  });

  describe('checkCache', () => {
    let request, response, next;

    beforeEach(() => {
      request = { params: { ip: '1.0.0.27' } };
      response = {
        status: jest.fn(() => response),
        json: jest.fn(),
      };
      next = jest.fn();
    });

    it('should return the cached country if IP is found in cache', () => {
      cache.has.mockReturnValue(true);
      cache.get.mockReturnValue('India');
      checkCache(request, response, next);
      expect(cache.has).toHaveBeenCalledWith('1.0.0.27');
      expect(cache.get).toHaveBeenCalledWith('1.0.0.27');
      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalledWith({ country: 'India' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next if IP is not found in cache', () => {
      cache.has.mockReturnValue(false);
      checkCache(request, response, next);
      expect(cache.has).toHaveBeenCalledWith('1.0.0.27');
      expect(next).toHaveBeenCalled();
      expect(cache.get).not.toHaveBeenCalled();
      expect(response.status).not.toHaveBeenCalled();
      expect(response.json).not.toHaveBeenCalled();
    });

    it('should throw an error if there is an issue', () => {
      cache.has.mockImplementation(() => {
        throw new Error('Unexpected error');
      });
      expect(() => checkCache(request, response, next)).toThrowError('Unexpected error');
    });
  });
});
