import jwt from 'jsonwebtoken';
import {promisify} from 'util';

import { config } from '../platform/index.js';
import {UsersRepo} from '../Repos/index.js';
import {AuthError} from '../Errors/index.js'

import { AugmentError } from '../ErrorUtils/index.js';


const Authenticate = async (req, res, next) => {

    const {authToken} = req.cookies;
    if( !authToken )throw new AuthError('auhtToken missing'); 
    
    let user;
    try {
        user = await promisify( jwt.verify )( authToken, config.SECRET );
    } catch (err) {
        res.cookie('authToken', '', {
            httpOnly: true,
            expires: new Date(0),
        });
        throw AugmentError( err, new AuthError( "Invalid authToken" ));
    }

    let userCheck = await UsersRepo.readUser( {username: user.username} );
    if (!userCheck) throw new AuthError('User doesn\'t exist');

    req.user = user;
    next();
}

export default Authenticate;