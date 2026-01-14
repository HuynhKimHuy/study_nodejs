import { Created, OK} from "../core/success.response.js"
import AccessService from "../services/access.service.js"

class AccessController{
    login = async (req,res,next )=>{
         new OK({
            message: "login Ok",
            statusCode:200,
            metadata: await AccessService.login(req.body)
         }).send(res)
    }
    
    signUp = async (req,res,next) => { 

            new Created({
                message:"Regisered OK",
                statusCode:200,
                metadata: await AccessService.SignUp(req.body)
            }).send(res)

    }
    logout = async (req,res,next)=>{
        new OK({
            message:'logout ok',
            statusCode:200,
            metadata: await AccessService.logout(req.keyStore)
        }).send(res)
    }
}

export default new AccessController()
