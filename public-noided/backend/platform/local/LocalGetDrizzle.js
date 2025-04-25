import {drizzle} from 'drizzle-orm/node-postgres';
import pg from 'pg';

import LocalGetParam from './LocalGetParam.js';

import { InternalError } from '../../Errors/index.js';
import { AugmentError } from '../../ErrorUtils/index.js';

const LocalGetDrizzle = async () => {

    try {
        const connectionString = LocalGetParam('DB_URL');

        const pool = new pg.Pool({
            connectionString: connectionString,
        })
        
        await pool.connect();
        const db = drizzle( pool );
        return db;
    
    } catch(err){

        throw AugmentError( err, new InternalError("Couldn\'t connect to database") );
    }
}

export default LocalGetDrizzle;