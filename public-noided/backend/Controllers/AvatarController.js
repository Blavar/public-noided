//import errors
import { config } from '../platform/index.js';
import fs from 'node:fs/promises';

import axios from 'axios';

import {updateAvatar} from '../platform/index.js';

import {UsersRepo} from '../Repos/index.js';
import { OwnershipError, ResourceError, InternalError } from '../Errors/index.js';
import { AugmentError } from "../ErrorUtils/index.js";


let AvatarController = {};

async function purgeCloudflareAvatarCache(filename) {
    
    const fileUrl = `${config.FRONTEND_URL}/avatars/${filename}`;

    const cloudflareZoneId = config.CLOUDFLARE_ZONE_ID; //config.CLOUDFLARE_ZONE_ID
    const cloudflareApiToken = config.CLOUDFLARE_API_TOKEN; //config.CLOUDFLARE_API_TOKEN
  
    const cloudflareApiUrl = `https://api.cloudflare.com/client/v4/zones/${cloudflareZoneId}/purge_cache/files`;

    const headers = {
      'Authorization': `Bearer ${cloudflareApiToken}`,
      'Content-Type': 'application/json'
    };
    
    const data = {
      files: [fileUrl]
    };
  
    try {
        const response = await axios.post(cloudflareApiUrl, data, { headers });
    } catch(err) {
        console.log(err);
    }
}


const avatarExists = async (filename) => {

    let files;
    try {
        files = await fs.readdir( config.__avatars );
    } catch(err) {
        throw AugmentError( err, new InternalError('Couldn\'t read avatar') );
    }

    return files.includes( filename )
}


//Move to controllers like come on
AvatarController.CheckAvatar = async (req, res, next) => {

    let url = req.url;

    const filename = url.split('/')[1].split('?')[0];
    let exists = await avatarExists( filename );
    if( !exists ) req.url = '/_.jpg'

    next();
}


AvatarController.UpdateAvatar = async(req, res, next) => {

    //by now i know that the resource user and the request user are the same
    //and that they exist most of all
    const {username} = req.params;

    let user = await UsersRepo.readUser( {username: username} );
    if (!user) throw new ResourceError('Avatar for non-existent user');

    const filename = username + '.jpg';
    const filepath = config.__img + '/' + filename;

    //creation of new avatars is automatic
    let data64 = req.body.data;
    data64 = data64.split(';base64,').pop();
    const buf = Buffer.from( data64, 'base64' );
    
    //!!
    await updateAvatar( filename, buf );

    if ( process.env.NODE_ENV === 'production' ) await purgeCloudflareAvatarCache( filename );

    res.send();
};

export default AvatarController;