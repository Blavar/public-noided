import https from 'https';
import fs from 'fs';


import app from './app.js';


const httpsPort = 443;



try {

    //credential fetching redacted, in production they are mounted onto the docker image
    //from ec2 and read
    const credentials = {

    }

    const httpsServer = https.createServer(credentials, app);

    httpsServer.listen(httpsPort, () => {
        console.log(`I stay noided at port ${httpsPort}`);
    });
} catch(err){
    
    console.error( 'Error starting the server\n', err );
}
