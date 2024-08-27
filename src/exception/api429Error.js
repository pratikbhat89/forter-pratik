const httpStatusCodes = require('../constants')
const BaseError = require('./baseError')

class Api429Error extends BaseError {
 constructor (
 name,
 statusCode = httpStatusCodes.LIMIT_EXCEEDED,
 description = 'Too many calls. Limit exceeded',
 isOperational = true
 ) {
 super(name, statusCode, isOperational, description)
 }
}

module.exports = Api429Error