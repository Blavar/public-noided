import dotenv from 'dotenv';
import path from 'node:path';
import fs from 'fs';

import __root from './__root.js';

dotenv.config({path: path.join( __root, '.env' )});

process.env.__root = __root;
process.env.__avatars  = path.join( __root, "avatars" );

const LocalGetParam = param => process.env[param];

export default LocalGetParam;