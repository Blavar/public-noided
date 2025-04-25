/**
 * choose certain function implementations based on the enviroment
 */

// This is local development version of the code, hence due to some oddities imports of AWS adapters had to be commented out.
// Needless to say they are actually being imported in production
// import RDSGetDrizzle from "./aws/RDSGetDrizzle.js";
// import SSMGetParam from "./aws/SSMGetParam.js";
// import S3UpdateAvatar from "./aws/S3UpdateAvatar.js";
// import S3GetAvatar from "./aws/S3GetAvatar.js";

import LocalGetDrizzle from "./local/LocalGetDrizzle.js";
import LocalGetParam from "./local/LocalGetParam.js";
import LocalUpdateAvatar from './local/LocalUpdateAvatar.js';

import {Users} from '../drizzle/schema.js';

const buildConfig = ( getter ) => {
    return new Proxy( {}, {
        get: ( target, param ) => getter( param )
    })
}

const init = async () => {
    let platform = {}
    if ( process.env?.NODE_ENV === 'production' ){
        
        platform = {
            config: buildConfig( SSMGetParam ),
            db: await RDSGetDrizzle(),
            getAvatar: S3GetAvatar,
            updateAvatar: S3UpdateAvatar 
        }
    } else {
        platform = {
            config: buildConfig( LocalGetParam ),
            db: await LocalGetDrizzle(),
            updateAvatar: LocalUpdateAvatar
        }
    }
    return platform;
}
let platform = await init();


export const config = platform.config;
export const db = platform.db;
export const updateAvatar = platform.updateAvatar;
export const getAvatar = platform.getAvatar;

