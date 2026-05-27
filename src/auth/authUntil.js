import JWT from 'jsonwebtoken'
import { asyncHandler } from '../helpers/asyncHandler.js'
import { AuthFailureError } from '../core/error.respone.js'
import KeyTokenService from '../services/keyToken.service.js'
import { getRefreshTokenFromCookies } from '../helpers/authCookie.js'


const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization',
    REFRESHTOKEN: 'refreshtoken'
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

const attachAuthContext = (req, keyStore, decode, refreshToken = null) => {
    req.keyStore = keyStore
    req.user = decode
    if (refreshToken) req.refreshToken = refreshToken
}

export const authentication = asyncHandler(async (req, res, next) => {
    const userID = req.headers[HEADER.CLIENT_ID]
    if (!userID) throw new AuthFailureError('Invalid Request')

    const keyStore = await KeyTokenService.findByID(userID)
    if (!keyStore) throw new AuthFailureError('Cannot find Keystore')


    const refreshToken = getRefreshTokenFromCookies(req) || req.headers[HEADER.REFRESHTOKEN]
    if (refreshToken) {
        const decode = JWT.verify(refreshToken, keyStore.privateKey)
        attachAuthContext(req, keyStore, decode, refreshToken)
        return next()
    }

    const accessToken = req.headers[HEADER.AUTHORIZATION]
    if (!accessToken) throw new AuthFailureError('Invalid Request')

    const decode = JWT.verify(accessToken, keyStore.privateKey)
    if (String(userID) !== String(decode.userID)) throw new AuthFailureError('Invalid UserID')
    attachAuthContext(req, keyStore, decode)
    return next()

})


export const createTokenPair = async (payload, privateKey) => {
    // normalize expiresIn values (no leading spaces)
    const accessToken = JWT.sign(payload, privateKey, { expiresIn: '5m' })
    const refreshToken = JWT.sign(payload, privateKey, { expiresIn: '1d' })

    return { accessToken, refreshToken }
}




export const verifyJWT = async (token, keySecret) => {
    return await JWT.verify(token, keySecret)
}
