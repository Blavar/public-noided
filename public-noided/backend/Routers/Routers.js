import express from 'express';
import { config } from '../platform/index.js';

import {AuthController, ThreadsController, AvatarController, AdminController} from '../Controllers/index.js';
import Middleware from '../Middleware/index.js'




const publicRouter  = express.Router();
const apiRouter     = express.Router();



publicRouter.use( '/avatars', AvatarController.CheckAvatar )
publicRouter.use( '/avatars', express.static( config.__avatars ));

publicRouter.get( '/threads', ThreadsController.GetThreads );
publicRouter.get( '/threads/:threadid', ThreadsController.GetThread );
publicRouter.get( '/threadposts/:threadid', ThreadsController.GetThreadPosts );

publicRouter.post( '/login', AuthController.Login );
publicRouter.post( '/register', AuthController.Register );
publicRouter.post( '/logout', AuthController.Logout );

//after this point, req.user.{username, role} is guaranteed
apiRouter.use( Middleware.Authenticate );

apiRouter.use( '/isAuth', (req, res, next) => res.send() )
//Router.use( Middleware.VerifyOwnership );

apiRouter.put( '/avatar/:username', AvatarController.UpdateAvatar );

apiRouter.post( '/thread', ThreadsController.CreateThread );

apiRouter.post(    '/post', ThreadsController.CreatePost );
apiRouter.put(     '/post/:postid', ThreadsController.EditPost );
apiRouter.delete(  '/post/:postid', ThreadsController.DeletePost );

//CAREFUL
apiRouter.use( '/admin', AdminController.AuthorizeAdmin );
apiRouter.get( '/admin/isAdmin', AdminController.IsAdmin );
apiRouter.get( '/admin/users', AdminController.GetUsers );



export {publicRouter, apiRouter};

