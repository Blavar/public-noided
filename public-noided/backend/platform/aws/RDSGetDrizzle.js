import {drizzle} from 'drizzle-orm/node-postgres';
import pg from 'pg';

import SSMGetParam from './SSMGetParam.js';

import { AWSError } from '../../Errors/index.js';
import { AugmentError } from '../../ErrorUtils/index.js';

const RDSGetDrizzle = async () => {
    
    try {
        const connectionString = await SSMGetParam('RDS_URL')
        const cas = [await SSMGetParam('RDS_CA1'), await SSMGetParam('RDS_CA2'), await SSMGetParam('RDS_CA3')];
        const ca = cas.join('\n');

        const rdsPool = new pg.Pool({
        
            connectionString: connectionString,
            ssl: {
                rejectUnauthorized: true,
                ca: ca
            },
        });

        await rdsPool.connect();
        const db = drizzle( rdsPool );
        return db;

    } catch (err) {
        throw AugmentError( err, new AWSError( "Database connection unsuccesful" ) );
    }
}

export default RDSGetDrizzle;