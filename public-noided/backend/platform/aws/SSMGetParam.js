import { SSMClient, GetParameterCommand, GetParametersByPathCommand } from "@aws-sdk/client-ssm";



import { AWSError } from "../../Errors/index.js";
import { AugmentError } from '../../ErrorUtils/index.js';


/**
 * For now its fetching all params at once in order to reduce wait time
 * and because none of the params really change frequently
 * The implementation can easily be changed to accomodate for on demand param fetching
 */


const paramPath = '/Noided';

const ssm = new SSMClient({ 
    region: "",

});


const getParametersByPath = async (path) => {

    let paramList = [];
    let nextToken = '';

    try {
        
        do{
            let command = new GetParametersByPathCommand({
                Path: path,
                WithDecryption: true,
                Recursive: true,
                NextToken: nextToken
            });
            let res = await ssm.send( command );
            if (res.Parameters) paramList.push( ...res.Parameters );
            
            nextToken = res.NextToken;
            
        } while (nextToken);

    } catch (err) {
        throw AugmentError( err, new AWSError("Couldn\'t fetch parameters from SSM") );
    }

    const params = paramList.reduce( ( acc, item ) => {
        const paramName = item.Name.split('/').slice(-1);
        acc[paramName] = item.Value;
        return acc;
    }, {})

    return params;
}

const params = await getParametersByPath(paramPath);

const SSMGetParams = param => params[param];

export default SSMGetParams;


