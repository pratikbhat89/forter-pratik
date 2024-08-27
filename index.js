const express = require('express');
const app = express();
const dotenv = require("dotenv");
const RateLimiter = require('limiter').RateLimiter;

dotenv.config();

const {validateIPAddress} = require('./src/ip-validator');

const { checkCache } = require('./src/node-cache');
const { getCountry } = require('./src/ip-country-service');
const httpStatusCodes = require('./src/constants');
app.use(express.json());

const PORT = process.env.PORT || 3000;

const ipStackRateLimit = process.env.IP_STACK_RATE_LIMIT;
const ipApiRateLimit = process.env.IP_API_RATE_LIMIT;
const limiterIpApi = new RateLimiter({ tokensPerInterval: `${ipApiRateLimit}`, interval: "hour", fireImmediately: true});
const limiterIpStack = new RateLimiter({ tokensPerInterval: `${ipStackRateLimit}`, interval: "hour", fireImmediately: true});

app.listen(PORT, () => {
    console.log("Server Listening on PORT:", PORT);
  });

app.get("/ip-to-country/:ip", checkCache, async (request, response) => {

    let ipAddr = request.params.ip;
    console.log("Serving request for IP : "+ipAddr);

    if (!ipAddr) {
      console.log("IP address is required");
      return response.status(httpStatusCodes.BAD_REQUEST).json({
        error: 'IP address is required'
      });
    }

    if(!validateIPAddress(ipAddr)) {
        console.log("IP address invalid");
        return response.status(httpStatusCodes.BAD_REQUEST).json({
          error: 'Invalid IP address'
        });
    } else {

      try {
        const country = await getCountry(ipAddr, limiterIpApi, limiterIpStack);
        response.json(country);
      } catch (error) {
        console.log(error);
        response.status(error.statusCode).json({ error: error.name });
      }
    }
});







