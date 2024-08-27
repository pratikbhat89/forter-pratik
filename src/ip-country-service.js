const axios = require('axios');
const ipStackAPIKey = process.env.IP_STACK_API_KEY;

const { setInCache } = require('./node-cache');
const Api429Error = require('./exception/api429Error');

const getCountryIpStack = async (ipAddress) => {
    try {
       const response = await axios.get(`https://api.ipstack.com/${ipAddress}`, {
            params: {
              access_key: `${ipStackAPIKey}`
            }
          });
          const country = response.data.country_name;
          setInCache(ipAddress, country);
          return { country };    
        } catch (error) {
        console.error('IP Stack vendor error:', error.message);
    }
  }
 
const getCountryIpApi = async (ipAddress) => {
    try {
      const response = await axios.get(`http://ip-api.com/json/${ipAddress}`);
      const country = response.data.country;
      setInCache(ipAddress, country);
      return { country };
    } catch (error) {
        console.error('IP API vendor error:', error.message);
    }
  }

const getCountry = async(ipAddr, limiterIpApi, limiterIpStack) => {
  
    const remainingRequestsIpApi = await limiterIpApi.removeTokens(1);
    console.log("Remaining requests for vendor IP API : "+remainingRequestsIpApi);
    if (remainingRequestsIpApi > 0) {
      return getCountryIpApi(ipAddr);
    }
  
    const remainingRequestsIpStack = await limiterIpStack.removeTokens(1);
    console.log("Remaining requests for vendor IP Stack : "+remainingRequestsIpStack);
    if (remainingRequestsIpStack > 0) {
      return getCountryIpStack(ipAddr);
    }
  
    console.log("Rate limit exceeded for both vendors");
    throw new Api429Error("Too Many Requests");
  }  

  module.exports= { getCountry };