import loggerService from "../logger/discord.logv2.js"

const pushToLogDiscord = async (req, res, next) => {
    try {
        loggerService.sendToFormateCode({
            titile:`${req.method} ${req.originalUrl}`,
            code: req.method === 'GET' ? JSON.stringify(req.query) : JSON.stringify(req.body),
            message: `${req.get('host')} ${req.originalUrl}` 
        });
    }
    catch (error) {
        next(error);
    }
    return next();
}

export default pushToLogDiscord;