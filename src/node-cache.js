const NodeCache = require( "node-cache" );
const cache = new NodeCache({stdTTL: 60*60*24});

const checkCache = (request, response, next) => {
    try {
      const ip  = request.params.ip;
      if (hasCache(ip)) {
        console.log("IP found in cache: "+ip);
        return response.status(200).json({country: getFromCache(ip)});

      }
      return next();
    } catch (err) {
      throw new Error(err);
    }
  };


const getFromCache = (ip) => {
    return cache.get(ip);
  }

const hasCache = (ip) => {
    return cache.has(ip);
  }  

const setInCache = (ip, country) => {
    cache.set(ip, country);
  }  

module.exports = { getFromCache, setInCache, hasCache, checkCache };
 