import path from 'node:path';
import fs from 'node:fs/promises';

import LocalGetParam from "./LocalGetParam.js"

import { InternalError } from '../../Errors/index.js';
import { AugmentError } from '../../ErrorUtils/utils.js';

const LocalUpdateAvatar = async ( key, body ) => {

    const filepath = path.join( LocalGetParam('__avatars'), key );
    try {
        await fs.writeFile( filepath, body, {encoding: "base64"} );
    } catch (err) {
        throw AugmentError( err, new InternalError('Failed to update avatar') );
    }
}

export default LocalUpdateAvatar;