import { UsersRepo } from "../Repos/index.js"

import { ResourceError, OwnershipError } from "../Errors/index.js";

const VerifyResource = async (req, res, next) => {

    if (req.user.role === 'admin') next();

    const user = req.user;
    const resource = req.body;
    if (!resource || !resource.username) throw new ResourceError('Bad resource');
    
    let owner = await UsersRepo.readUser({username: resource.user});
    if( !owner || owner.username !== user.username) throw new OwnershipError('Resource access by non-owner');

    next();
}

export default VerifyResource;