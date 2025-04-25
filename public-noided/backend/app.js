import 'express-async-errors';
//Generate ErrorTypes, error wrap all the middleware, controllers, repos
//VERY important for it to run before anything else 
import './error-wrapper.js';
import express from 'express';

import cors from 'cors';
import rateLimit from 'express-rate-limit';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

import { config } from './platform/index.js';
import Middleware from './Middleware/index.js';
import {publicRouter, apiRouter} from './Routers/index.js'

// = = = = = = = = = = = = = = = = = = = = = =

const app = express();

app.set('trust proxy', true);

app.use(cors({
    origin: config.FRONTEND_URL,
    methods: ['GET','PUT','POST','DELETE'],
    credentials: true,
}));

//!!!/
// app.use( rateLimit({
//     windowMs: 10 * 60 * 1000, // 10 minutes
//     max: 200, 
//     message: 'Too many requests, please try again later.',
//     standardHeaders: true, 
//     legacyHeaders: false, 
//     })
// );

app.use(express.urlencoded({
    extended: true
}));

app.use(bodyParser.json({ 
    type: 'application/json', 
    limit: config.DATA_LIMIT
}))

app.use(cookieParser())

// = = = = = = = = = = = = = = = = = = = = = =

app.use( Middleware.Logging );

app.use( '/api/', publicRouter );
app.use( '/api/auth', apiRouter );
app.use( Middleware.NotFoundHandler );
app.use( Middleware.ErrorHandler );



const port = config.PORT;
app.listen(port, () => {
    console.log( `listening on port ${port}` );
});

export default app;