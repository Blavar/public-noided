import path from 'node:path';
import fs, { read } from 'node:fs';

const CONFIG_FILE = 'templates.json';

const SUFFIX = 'Error';

const CATEGORY_TEMPLATE = "template";
const VAR_SYMBOL = '_';
const TYPE_VAR = "_type";
const CATEGORY_VAR = "_category";


const readErrorData = (filename) => {
    const __config = path.join( import.meta.dirname, filename );
    let errorData;
    errorData = fs.readFileSync( __config, 'utf-8' );
    errorData = JSON.parse( errorData );

    return errorData;
}


//= = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =


const copy = ( obj ) => {

    if ( typeof obj !== 'object' ) return obj;

    let res = {};
    for( const prop in obj ) res[prop] = copy( obj[prop] );
    return res;
}


const getProps = ( template ) => {

    let propList = []
    for( const propName in template ) propList.push( propName );
    return propList;
}


const mergeLists = ( ...propLists ) => {

    let finalList = [];
    for ( const list of propLists ) finalList.push( ...list );
    finalList = [ ...new Set(finalList) ];
    return finalList;
}


//= = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =


const isVar = (str) => {
    return ( typeof str === 'string' && str[0] === VAR_SYMBOL ? true : false  );
}


//again receives an OBJECT
const getVars = (template) => {

    //termination
    if (typeof template !== 'object'){
        if ( isVar(template) ) return [template];
        else return [];
    }

    let result = []
    for (const prop in template){

        result.push( ...getVars( template[prop] ) );
    }
    return result;
}


const VarDictionary = (template) => {
    const vars = mergeLists( getVars( template ) )

    let result = {};
    for (const prop of vars) result[prop] = null;
    return result;
}


const applyDictionary = (source, dictionary) => {

    if (typeof source !== 'object'){
        if ( isVar(source) ){
            for(const variable in dictionary){
                if(source === variable && dictionary[variable]) return dictionary[variable];
            }
        }
        else return source;
    }

    for( const prop in source ) source[prop] = applyDictionary( source[prop], dictionary );
    return source;
}


const applySymbols = ( template, Symbols ) => {

    let result = {};
    for ( const symbolName in Symbols ){

        if ( template[symbolName] ){
            result[ Symbols[symbolName]  ] = template[symbolName];
        }
    }
    return result;
}


//= = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =

//recursive, receives OBJECTS or VALUES, NOT PROP NAMES
const applyTemplate = ( source, template ) => {

    if (!source && !template) return null;

    if( !source ) return copy(template);
    else if( !template ) return source;
    
    if( typeof source !== 'object' || typeof template !== 'object' ) return source;

    let result = {};

    const propList = mergeLists( getProps(template), getProps(source) );

    for( const prop of propList ){
        //for each prop, if source doesnt have it, get templates
        //if both have it, recursively applyTemplate
        if( !source[prop] && template[prop] ) result[prop] = copy(template[prop]);
        else result[prop] = applyTemplate( source[prop], template[prop] );
    }

    return result;
}


const createErrorTemplates = ( data, Symbols ) => {

    let result = {}

    const template = data[CATEGORY_TEMPLATE];

    for ( const errorName in data ){

        if ( errorName !== CATEGORY_TEMPLATE){

            let error = data[errorName];

            const type = errorName+SUFFIX;
            let dictionary = {
                _type: type,
                _category: template.meta.category
            };

            error = applyTemplate( error, template );
            error = applyDictionary( error, dictionary );
            
            result[type] = error;
        }
    } 

    return result;
}


//= = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =


const createSymbols = () => {

    let symbolList = [];

    for( const templateName in errorData ) symbolList.push( getProps( errorData[templateName] ) );
    symbolList = mergeLists( ...symbolList );

    let Symbols = {};
    for( const symbolName of symbolList ) Symbols[symbolName] = Symbol(symbolName);

    return Symbols;
}


//given error template, create a constructor for its custom type
//made possible with kind help from Google Gemini
function ErrorTypeFactory( template, Symbols ){

    //produce a constructor
    const ErrorConstructor = function( message='', uiFeedback='' ){

        Error.call( this );

        this.name = template.meta.name;
        for ( const propName in template ) this[Symbols[propName]] = template[propName];
        this[Symbols.meta].message = message;
        this[Symbols.meta].uiFeedback = uiFeedback;
    }

    Object.defineProperty(ErrorConstructor, 'name', {
        value: template.meta.name,
        writable: false,
        configurable: true
    });

    ErrorConstructor.prototype = Object.create( Error.prototype );
    ErrorConstructor.prototype.constructor = ErrorConstructor;

    return ErrorConstructor;
}


//= = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =


let ErrorTypes = {};

const errorData = readErrorData(CONFIG_FILE);
const Symbols = createSymbols( errorData )
const ErrorTemplates = createErrorTemplates(errorData, Symbols);

for (const errorName in ErrorTemplates){
    ErrorTypes[errorName] = ErrorTypeFactory( ErrorTemplates[errorName], Symbols );
}

export default ErrorTypes;



//buildIndex( import.meta.url )