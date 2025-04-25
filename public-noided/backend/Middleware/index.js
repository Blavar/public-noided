import Authenticate from "./Authenticate.js";
import ErrorHandler from "./ErrorHandler.js";
import VerifyOwnership from './VerifyOwnership.js'
import NotFoundHandler from "./NotFoundHandler.js";
import Logging from "./Logging.js";

import { MiddlewareWrapper } from "../ErrorUtils/ErrorWrappers.js";

let Middleware = {};
Middleware.Authenticate     = MiddlewareWrapper(Authenticate, "Authenticate");
Middleware.VerifyOwnership  = MiddlewareWrapper(VerifyOwnership, "VerifyOwnership" );
Middleware.NotFoundHandler  = MiddlewareWrapper(NotFoundHandler, "NotFoundHandler");
Middleware.Logging          = MiddlewareWrapper(Logging, "Logging");
//Error wrapping the ErrorHandler messes with the whole mechanism
Middleware.ErrorHandler     = ErrorHandler;


export default Middleware;
