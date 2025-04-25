import { getSymbols } from '../ErrorUtils/index.js'
import { ClientError } from '../Errors/index.js';



const ErrorHandler = async (err, req, res, next) => {
    
    if (req?.logger) req.logger.logError( err );
    console.log(err);
    const Symbols = getSymbols( err );
    const $meta = Symbols.meta;
    //if it has the symbol that means that the error was incercepted
    //and more or less expected
    if( err[$meta] ){
        const meta = err[$meta];
        const code = meta.statusCode;
        const uiFeedback = meta.uiFeedback;

        res.status(code);
        if (uiFeedback) res.json({ uiFeedback: uiFeedback});
        else res.send();
    }
    else res.status(500).send();
}

export default ErrorHandler;