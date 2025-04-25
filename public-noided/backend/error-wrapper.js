import * as Controllers from "./Controllers/index.js";
import * as Repos from "./Repos/index.js";

import { ControllerWrapper, RepoWrapper } from "./ErrorUtils/ErrorWrappers.js";

for( const ctrlName in Controllers){
    const ctrl = Controllers[ctrlName];
    ControllerWrapper( ctrl, ctrlName );
}

for( const repoName in Repos ){
    const repo = Repos[repoName];
    RepoWrapper( repo, repoName );
}

