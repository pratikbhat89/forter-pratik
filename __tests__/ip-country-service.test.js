const axios = require('axios');
const { RateLimiter } = require('limiter');
const { getCountry } = require('../src/ip-country-service');
const { setInCache } = require('../src/node-cache');
const Api429Error = require('../src/exception/api429Error');

// Mocks
jest.mock('axios');
jest.mock('../src/node-cache', () => ({
  setInCache: jest.fn()
}));
jest.mock('../src/exception/api429Error', () => {
  return class Api429Error extends Error {
    constructor(message) {
      super(message);
      this.name = 'Api429Error';
    }
  }
});

console.error = jest.fn();

describe('getCountry', () => {

    let limiterIpApi;
    let limiterIpStack;
    let ipAddr = '12.1.0.5';
    let testCountry = 'USA';
  
    beforeEach(() => {
      jest.clearAllMocks();
      
      // Mock RateLimiter instances
      limiterIpApi = { removeTokens: jest.fn() };
      limiterIpStack = { removeTokens: jest.fn() };
    });


    it('should return country from IP API when rate limit is not exceeded', async () => {
        limiterIpApi.removeTokens.mockResolvedValue(1); 
        axios.get.mockResolvedValue({ data: { country: testCountry } });
    
        const result = await getCountry(ipAddr, limiterIpApi, limiterIpStack);
        
        expect(result).toEqual({ country: testCountry });
        expect(setInCache).toHaveBeenCalledWith(ipAddr, testCountry);
    });

    it('should return country from IP Stack when IP API rate limit is exceeded', async () => {
        limiterIpApi.removeTokens.mockResolvedValue(0);
        limiterIpStack.removeTokens.mockResolvedValue(1);
        axios.get.mockResolvedValue({ data: { country_name: testCountry } });
    
        const result = await getCountry(ipAddr, limiterIpApi, limiterIpStack);
        
        expect(result).toEqual({ country: testCountry });
        expect(setInCache).toHaveBeenCalledWith(ipAddr, testCountry);
      });

      it('should throw Api429Error when rate limits are exceeded for both vendors', async () => {
        limiterIpApi.removeTokens.mockResolvedValue(0);
        limiterIpStack.removeTokens.mockResolvedValue(0); 
    
        await expect(getCountry(ipAddr, limiterIpApi, limiterIpStack)).rejects.toThrow(Api429Error);
      });

      it('should handle errors from IP API and IP Stack gracefully', async () => {
        limiterIpApi.removeTokens.mockResolvedValue(1); 
        limiterIpStack.removeTokens.mockResolvedValue(0); 
        axios.get.mockRejectedValueOnce(new Error('IP API error')); // IP API error
    
        const result = await getCountry(ipAddr, limiterIpApi, limiterIpStack);
        
        expect(result).toBeUndefined();
        expect(console.error).toHaveBeenCalledWith('IP API vendor error:', 'IP API error');
      });

});
