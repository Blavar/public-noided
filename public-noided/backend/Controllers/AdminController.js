import { UsersRepo } from "../Repos/index.js";

import { AuthorizationError } from "../Errors/index.js";

const AdminController = {}
//CAREFUL

AdminController.AuthorizeAdmin = async (req, res, next) => {

    const {user: reqUser} = req;

    let user = await UsersRepo.readUser({ username: reqUser.username });
    if ( user?.role !== 'admin' ) throw new AuthorizationError("UNATHORIZED");

    next();
}

AdminController.IsAdmin = async (req, res, next) => {
    res.json( {isAdmin: true} );
}

AdminController.GetUsers = async (req, res, next) => {

    let users = await UsersRepo.readUser();
    //!!!
    users = users.map( user => {return {username: user.username}} );
    res.json({users: users});
}

export default AdminController;