import JWT from 'jsonwebtoken'
import { asyncHandler } from '../helpers/asyncHandler.js'
import { AuthFailureError } from '../core/error.respone.js'
import KeyTokenService from '../services/keyToken.service.js'


const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization'
}

export const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        const accessToken = JWT.sign(payload, privateKey, {
            expiresIn: '2days'
        })

        const refreshToken = JWT.sign(payload, privateKey, {
            expiresIn: '7 days'
        })

        JWT.verify(accessToken, privateKey, (err, decode) => {
            if (err) {
                console.log("error verify", err);
            }
            else {
                console.log('decode verify', decode)
            }
        })
        return { accessToken, refreshToken }
    } catch (error) {
        throw error
    }
}


// authentication 
/*
step1 : check userId in req Header
step2 : get accesss token  
step3 : verify token 
step4 : check user in db 
step5 : check keystore with userID
step6 : If ok => Next
*/
export const authentication = asyncHandler(async (req, res, next) => {
    const userID = req.headers[HEADER.CLIENT_ID]
    if (!userID) throw new AuthFailureError('Invalid Request')

    const keyStore = await KeyTokenService.findByID(userID)
    if (!keyStore) throw new AuthFailureError('Cannot find Keystore')

    const accessToken = req.headers[HEADER.AUTHORIZATION]
    if (!accessToken) throw new AuthFailureError('Invalid Request')

    try {
        const decode = JWT.verify(accessToken, keyStore.privateKey)
        if (String(userID) !== String(decode.userID)) throw new AuthFailureError('Invalid UserID')
        req.keyStore = keyStore
        req.user = decode
        return next()
    }
    catch (error) {
        throw error
    }
})
