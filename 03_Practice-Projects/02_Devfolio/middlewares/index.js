// Add Middleware Functions Here and Export it.

const {verifyJwtToken} = require('../src/verifyJwtToken.js');
const { TokenExpiredError, NotBeforeError, JsonWebTokenError } = require('jsonwebtoken');



////////////////////////////////////////////////////////////////////////////
//                      Jwt Token Verificator Middleware
////////////////////////////////////////////////////////////////////////////
module.exports.verifyJwt = async (req, res, next)=>{
    console.log("Inside verifyJwt():", req.session.user);
    const accessToken = req.session?.user?.accessToken;
    console.log('accessToken :>> ', accessToken); 
    if(!accessToken){
        return res
        .status(401)
        .json({message: "Unauthorized Request!!! ⚠️"})
    }
    

    try {
        const decodedToken = await verifyJwtToken(accessToken)
        console.log('decodedToken :>> ', decodedToken);
        next();
    } 
    catch (error) {
        console.log("\n\nSome Error Occured While Verifying AccessToken!\n\n");
        console.log("\n\nError :>> ", error, "\n\n");
        // throw new Error("Error While Accessing Protected Route!!! ⚠️❌")

        if (error instanceof TokenExpiredError) {
            return res.status(401).send({ success: false, message: 'Unauthorized! Access Token was expired!' });
        }
        if (error instanceof NotBeforeError) {
        return res.status(401).send({ success: false, message: 'jwt not active' });
        }
        if (error instanceof JsonWebTokenError) {
        return res.status(401).send({ success: false, message: 'jwt malformed' });
        }
    }

    // const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
    // if(!user){ new ApiError(404, "Invalid AccessToken!!!");}
    // req.user = user;
    
};
