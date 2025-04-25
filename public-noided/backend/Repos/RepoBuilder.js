import {db} from '../platform/index.js';
import { eq, lt, gte, ne } from 'drizzle-orm';


function getPrimaryKey(Schema){

    for(const column in Schema){
        if( Schema[column].config.primaryKey ) return column;
    }
}       

function getSingular(Schema){

    const nameSymbol = Object.getOwnPropertySymbols(Schema)[0];
    const singular = Schema[nameSymbol].slice(0, -1);
    return singular;
}       

const standardMethods = (Schema) => {

    const primaryKey = getPrimaryKey(Schema);

    const readAll = async() => {
        return await db.select().from(Schema);
    }

    const read =  async ( item ) => {
        
        if (!item) return await readAll();
        let data = await db
                        .select()
                        .from(Schema)
                        .where( eq( Schema[primaryKey], item[primaryKey] ) );
   
        if ( data && data.length !== 0) return data[0];
    }
    const create = async (item) => {
        const result = await db.insert(Schema).values(item).returning();
        return result[0];
    }
    const update = async ( item ) => {
        return await db
                    .update(Schema)
                    .set(item)
                    .where( eq( Schema[primaryKey], item[primaryKey] ) )
                    .returning();
    }
    const del = async ( item ) => {
        return await db
                    .delete(Schema)
                    .where( eq( Schema[primaryKey], item[primaryKey] ));
    }
    
    return {
        read: read,
        create: create,
        update: update,
        delete: del
    }
}


class RepoBuilder{

    constructor( Schema, name='' ){

        this.Repo = {}

        this.singular = getSingular( Schema );
        this.repoName = ( name ) ? name : `${this.singular}Repo`;

        this.primaryKey = getPrimaryKey( Schema );

        this.standard = standardMethods( Schema );

    }

    buildMethod( name, method ){

        if (!method) {
            method = name
            name=name.name;
        }
        //if !typeof method === 'function' implementation? error
        
        this.Repo[name] = method;
        
        return this;
    }

    buildRead( name ){

        if (!name) name=`read${this.singular}`;
        this.buildMethod( name, this.standard.read );
        return this;
    }

    buildCreate( name ){

        if (!name) name=`create${this.singular}`;
        this.buildMethod( name, this.standard.create );
        return this;
    }

    buildUpdate( name ){

        if (!name) name=`update${this.singular}`;
        this.buildMethod( name, this.standard.update );
        return this;
    }

    buildDelete( name ){

        if (!name) name=`delete${this.singular}`;
        this.buildMethod( name, this.standard.delete );
        return this;
    }

    buildCRUD(){

        this.buildRead();
        this.buildCreate();
        this.buildUpdate();
        this.buildDelete();
        return this;
    }

    build(){
        return this.Repo;
    }
}

export default RepoBuilder;