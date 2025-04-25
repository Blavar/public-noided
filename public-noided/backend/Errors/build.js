import fs from 'node:fs'
import path from 'node:path'

//by convention same as directory name

const ModuleName = path.basename( path.dirname(import.meta.url) );
const url = `./${ModuleName}.js`;

//at the same time initializes and generates the ErrorTypes
const Module = (await import(url)).default;

let script = ``;
script += `import ${ModuleName} from '${url}';\n\n`
for( const prop in Module ) script += `export const ${prop} = ${ModuleName}.${prop}\n`;

const temp = 'index.js'
let tempPath = path.join( import.meta.dirname, temp );
fs.writeFileSync( tempPath, script );












