import AccessService from "../services/access.service.js"

class AccessController{
    signUp = async (req,res,next) => {
        try {
            console.log(`[P]::signup::`, req.body)
            return res.status(201).json(await AccessService.SignUp(req.body))
        } catch (error) {
            next(error)
        }
    }
}
export default new AccessController()