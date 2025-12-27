import { Created } from "../core/success.response.js"
import AccessService from "../services/access.service.js"

class AccessController{
    signUp = async (req,res,next) => { 

            new Created({
                message:"Regisered OK",
                status:200,
                metadata: await AccessService.SignUp(req.body)
            }).send(res)
            
       
    }
}

export default new AccessController()