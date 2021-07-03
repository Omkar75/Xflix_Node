import Joi from 'joi'
import objectId from './custom.validiation.js'

/**
 * Example url: `/v1/users/:userId`
 * Validate the "userId" url *params* field. "userId" value should be a
 * - string
 * - valid Mongo id -> Use the helper function in src/validations/custom.validation.js
 */
const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId, 'customValidiator')
  }),
};


// Requiring ObjectId from mongoose npm package
/*const ObjectId = require('mongoose').Types.ObjectId;
  
// Validator function
function isValidObjectId(id){
      
    if(ObjectId.isValid(id)){
        if((String)(new ObjectId(id)) === id)
            return true;        
        return false;
    }
    return false;
}*/
export default getUser;