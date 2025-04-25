import { ContextWrapper } from "./utils.js";

const MiddlewareWrapper = ( middleware, name ) => {
    return ContextWrapper( middleware, {middleware: name});
}


const ControllerWrapper = (ctrl, ctrlName) => {

    for (const methodName in ctrl){

        const method = ctrl[methodName];
        ctrl[methodName] = ContextWrapper( method, {ctrl: ctrlName, ctrlMethod: methodName});
    }
}


const RepoWrapper = (repo, repoName) => {

    for (const methodName in repo){
        const method = repo[methodName];
        repo[methodName] = ContextWrapper( method, {repo: repoName, repoMethod: methodName});
    }
}


export {MiddlewareWrapper, ControllerWrapper, RepoWrapper };