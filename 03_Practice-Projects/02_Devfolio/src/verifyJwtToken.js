const jwt = require('jsonwebtoken');
const { publicKey } = require('../config/index.config.js').keys;
const {JWT_TOKEN_HEADERS} = require("./constants.js");

const verifyJwtToken = (token) => 
    new Promise((resolve, reject)=>{
        jwt.verify(
            token,
            publicKey,
            JWT_TOKEN_HEADERS,
            (err, decoded) => {
                if(err){ return reject(err); }
                return resolve(decoded);
            }
        );
    });


module.exports = Object.assign({}, {verifyJwtToken});