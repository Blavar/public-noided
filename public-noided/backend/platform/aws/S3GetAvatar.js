import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';

import SSMGetParam from './SSMGetParam.js';

import { AWSError } from '../../Errors/index.js';
import { AugmentError } from '../../ErrorUtils/index.js';


const bucket = await SSMGetParam('S3BUCKET')

const s3Client = new S3Client({
    region: '',
});

const getObjectCommand = ( Key, Body ) => {
    return new GetObjectCommand({
        Bucket: bucket,
        Key: `avatars/${Key}`,
    });
}

const S3GetAvatar = async ( Key ) => {
    try {
        return await s3Client.send( getObjectCommand( Key ) );
    } catch(err){
        throw AugmentError( err, new AWSError("Couldn\'t put in a bucket") );
    }
}
 
export default S3GetAvatar;


