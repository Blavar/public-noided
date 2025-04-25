import { RoutineError } from "../Errors/index.js";

const copy = ( obj ) => {

    if ( typeof obj !== 'object' ) return obj;

    let res = {};
    for( const prop in obj ) res[prop] = copy( obj[prop] );
    return res;
}


const addSymbol = ( source, symbol ) => {
    source[symbol] = {};
    return source;
}


const addSymbolData = ( source, symbol, data ) => {

    if (!source[symbol]) source = addSymbol(source, symbol);
    for (const prop in data) source[symbol][prop] = copy( data[prop] );
    return source;
}


const copySymbol = ( source, template, symbol ) => {
    return addSymbolData( source, symbol, template[symbol] );
}


const copySymbols = (source, template) => {

    const Symbols = getSymbols( template );
    for( const symbolName in Symbols ){
        if (template[Symbols[symbolName]]) source = copySymbol( source, template, Symbols[symbolName] );
    }
    return source;
}


//returns a dictionary of symbols of a given Error Type
const  getSymbols = ( obj ) => {

    let Symbols = {};

    const SymbolsList = Object.getOwnPropertySymbols( obj );
    for ( const symbol of SymbolsList ) Symbols[symbol.description] = symbol;

    return Symbols;
}


const RoutineErrorTemplate = new RoutineError();
const Symbols = getSymbols( RoutineErrorTemplate );


const ContextWrapper = ( method, contextData ) => {

    return async (...args) => {
        try {
            return await method(...args);
        } catch (err) {
            err = addSymbolData( err, Symbols.context, contextData);
            throw(err);
        }
    }
}


const AugmentError = (err, ErrorInstance) => {
    return copySymbols( err, ErrorInstance );
}


export { copySymbols, getSymbols, ContextWrapper, AugmentError };

