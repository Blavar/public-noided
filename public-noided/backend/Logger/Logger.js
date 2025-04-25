import { RoutineError } from "../Errors/index.js";
import { getSymbols } from "../ErrorUtils/index.js";

const ErrorSymbols = getSymbols( new RoutineError('') );

class Logger{

    constructor( req, res ){
        this.isWritten = false;

        this.req = {};
        this.res = {};
        this.err = {};

        this.processRequest( req );
        this.interceptResponse( res );

    }


    write(){

        console.log("===REQUEST===")
        console.log( JSON.stringify( this.req, null, 3 ) );

        console.log("===ERROR===");
        console.log(this.err);

        console.log("===RESPONSE===");
        console.log( JSON.stringify(this.res, null, 3) );
        console.log("\n")
        this.isWritten = true;
    }


    createUserProxy( user ){

        this.req.user = {};

        this.userProxy = new Proxy( user, {
            get: (target, prop) => {
                return prop in target ? target[prop] : undefined;
            },
            set: (target, prop, value) => {
                this.req.user[prop] = value;
                target[prop] = value;
                return true;
            },
            has: (target, prop) => {
                return prop in target;
            }
        });
    }

    processRequest( req ){

        const {body} = req;
        let bodyData; 

        if  ( body?.user?.password ) {

            bodyData = {
                user: {
                    username: req.body?.user.username,
                    password: '*****'
                }
            }
        } else if ( body?.data && body.data.length > 50 ) {

            bodyData = {
                user: body.username,
                data: body.data.slice(0,50)
            }

        } else {
            bodyData = req.body;
        }

        this.req.url = req.url;
        this.req.method = req.method;
        this.req.body = bodyData;

        if ( !(req?.user) ) req.user = {};
        this.createUserProxy( req.user );

        this.req.time = new Date();
    }


    logError( err ) {

        const Symbols = getSymbols( err );
        this.err = err;

        // if (err[Symbols.meta]) this.err.meta = err[Symbols.meta];
        // if (err[Symbols.context]) this.err.context = err[Symbols.context];

        this.write();
    }

    interceptResponse( res ) {

        const originalStatus = res.status.bind(res);

        const originalSend = res.send.bind(res);
        const originalJson = res.json.bind(res);
        const originalEnd  = res.end.bind(res);


        res.status = (statusCode) => {
            this.res.statusCode = statusCode;
            return originalStatus(statusCode);
        }

        res.send = (data) => {
            this.res.send = data;
            return originalSend( data );
        }

        res.json = (body) => {
            this.res.json = body;
            return originalJson( body );
        }

        res.end = ( ...args ) => {
            this.write();
            return originalEnd( ...args );
        }
    }
}

export default Logger;