import { Created, OK } from "../core/success.response.js"
import AccessService from "../services/access.service.js"
import { clearRefreshTokenCookie, setRefreshTokenCookie } from "../helpers/authCookie.js"

class AccessController {
    handleRefreshToken = async (req, res) => {
        const result = await AccessService.handleRefreshToken(
            {
                user: req.user,
                keyStore: req.keyStore,
                refreshToken: req.refreshToken
            }
        )

        setRefreshTokenCookie(res, result?.token?.refreshToken)
        new OK({
            message: "Get Token success",
            statusCode: 200,
            metadata: result
        }).send(res)
    }

    login = async (req, res) => {
        const result = await AccessService.login(req.body)

        setRefreshTokenCookie(res, result?.tokens?.refreshToken)
        new OK({
            message: "login Ok",
            statusCode: 200,
            metadata: result
        }).send(res)
    }

    signUp = async (req, res) => {
        new Created({
            message: "Regisered OK",
            statusCode: 200,
            metadata: await AccessService.SignUp(req.body)
        }).send(res)
    }

    logout = async (req, res) => {
        clearRefreshTokenCookie(res)
        new OK({
            message: 'logout ok',
            statusCode: 200,
            metadata: await AccessService.logout(req.keyStore)
        }).send(res)
    }
}

export default new AccessController()
