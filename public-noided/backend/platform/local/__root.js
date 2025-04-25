import path from 'node:path';
import fs from 'node:fs';

let dir = import.meta.dirname;
while (  !fs.readdirSync(dir).includes( "package.json" ) ) dir = path.dirname( dir );
const __root = dir;

export default __root;


