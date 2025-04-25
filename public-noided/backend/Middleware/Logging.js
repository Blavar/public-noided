import Logger from "../Logger/Logger.js";

export default function Logging( req, res, next ){

    const logger = new Logger( req, res );
    req.logger = logger;

    next();
}