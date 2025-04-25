import jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import {promisify} from 'util';

import axios from 'axios';

import { config } from '../platform/index.js';
import {UsersRepo} from '../Repos/index.js';

import {FormError, AuthError, ClientError} from '../Errors/index.js';
import { AugmentError } from '../ErrorUtils/index.js';


let AuthController = {};


async function sendCredentials( res, user ){

    const exp = Number(config.TOKEN_EXP);

    //very important to send a filtered user data, especially wihtout the password
    const payload = {
        username: user.username,
        role: user.role
    }

    let token;

    token = await promisify(jwt.sign)( payload, config.SECRET, {expiresIn: exp});

    res.cookie("authToken", token, {httpOnly: true, maxAge: exp*1000});
    res.json( {user: payload} );
}


async function verifyTurnstile( req ){

    const { turnstileResponse } = req.body;
    const {ip} = req.ip;

    try {
        let res = await axios.post( config.CLOUDFLARE_URL, {
            secret: config.CLOUDFLARE_KEY,
            response: turnstileResponse,
        }, {
            headers: {'Content-Type': 'application/json'},
        });
        return res.data.success;
    } catch (err) {
        return false;
    }
}



//= = = = = = = = = = = = = = = = = = = = = = = 


async function validateForm( username, password ){

    let errUsername = '';
    let errPassword = '';

    //only allowed symbols

    if( !username ) errUsername = 'Having a name is nice';
    else if( username.length < 5 || username.length > 20 ) errUsername = 'Must have between 5 and 10 characters';
    //include numbers
    else if ( !/^[a-zA-Z_]+$/.test( username ) ) errUsername = 'Can only contain letters and _';

    if( !password ) errPassword = 'You\'ll need a password, trust me';
    else if( password.length < 8 || password.lenght > 20 ) errPassword = 'Must have between 8 and 20 characters';
    else if( !/[#_%&]/.test(password) ) errPassword = 'Must contain one of # _ & %';
    //include numbers
    else if ( !/^[a-zA-Z0-9_#%&]+$/.test( password ) ) errPassword = 'Can only contain letters, digits and # _ & %';

    let user = await UsersRepo.readUser( {username: username} )
    if (user) errUsername = 'Username already taken';

    if( errUsername || errPassword ) return { username: errUsername, password: errPassword };
}


// = = = = = = = = = = = = = = = = = = = = = = = = = = 

/*
someone might have a token
    it expired and is hanging ther
    user may not have his credentials on the backend
*/

AuthController.Register = async (req, res, next) => {
    ///throw new ClientError('nope')
    const {authToken} = req.cookies;
    if ( authToken ) throw new ClientError( 'User already logged in' );

    let turnstileValid = await verifyTurnstile( req );
    if (!turnstileValid) throw new ClientError("Invalid turnstile response");

    const { user } = req.body;
    if( !user ) throw new ClientError( 'Missing registration form' );

    const {username, password} = req.body.user;

    let feedback = await validateForm( username, password );
    if (feedback) throw new FormError( "Bad registration form", feedback );

    let hashed = await bcrypt.hash( password, 10 )
    const userData = {
        username: username,
        password: hashed
    }
    await UsersRepo.createUser( userData );
    
    let actualUser = await UsersRepo.readUser({username: username});

    await sendCredentials( res, actualUser );
}

//change to just Login Error?
AuthController.Login = async (req, res, next) => {

    let turnstileValid = await verifyTurnstile( req );
    if (!turnstileValid) throw new ClientError("Invalid turnstile response");

    const { user } = req.body
    if ( !user ) throw new FormError('Missing login data');

    const {username, password} = user;
    if( !username || !password ) throw new FormError('Missing login credentials');

    //it is absolutely crucial for the Client error to NOT send details to the client
    let actualUser = await UsersRepo.readUser( {username: username} );
    if ( !actualUser ) throw new FormError('User doesn\'t exist');

    const hashed = actualUser.password;
    let match = await bcrypt.compare( password, hashed );
    if( !match ) throw new FormError('Incorrect credentials');

    //couple lines later: sendCrenetials(user);
    await sendCredentials( res, actualUser );
}


AuthController.Logout = async (req, res, next) => {

    res.cookie('authToken', '', {
        maxAge: 0, 
        httpOnly: true,
        //secure: true;
    });
    res.send();
}


export default AuthController;