import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

import SSMGetParam from './SSMGetParam.js';

import { AWSError } from '../../Errors/index.js';
import { AugmentError } from '../../ErrorUtils/index.js';


const bucket = await SSMGetParam('S3BUCKET')

const s3Client = new S3Client({
    region: '',

});

const putObjectCommand = ( Key, Body ) => {
    return new PutObjectCommand({
        Bucket: bucket,
        Key: `avatars/${Key}`,
        Body: Body,
        Metadata: {
            "Cache-Control": "public, max-age=3600",
        },
    });
}

const S3UpdateAvatar = async ( Key, Body ) => {
    try {
        return await s3Client.send( putObjectCommand( Key, Body ) );
    } catch(err){
        throw AugmentError( err, new AWSError("Couldn\'t put in a bucket") );
    }
}
 
export default S3UpdateAvatar;

