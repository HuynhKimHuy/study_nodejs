import NotifiService from "../services/notifi.service.js";
import { Created, OK } from "../core/success.response.js";

class NotiController {

    ListNotiByUserId = async (req, res) => {
        new Created({
            message: "Post notification successfully",
            metadata: await NotifiService.ListNotiByUserId({
                ...req.query,
            })
        }).send(res)
    }

}

export default new NotiController()