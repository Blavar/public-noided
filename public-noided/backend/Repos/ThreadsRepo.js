import {db} from '../platform/index.js';
import RepoBuilder from './RepoBuilder.js';

import { eq, lt, gte, ne, sql } from 'drizzle-orm';

import {Threads} from '../drizzle/schema.js';

const builder = new RepoBuilder(Threads);

builder.buildRead();
builder.buildCreate();
builder.buildDelete();

builder.buildMethod( 'updateLastPosted', async ( thread ) => {

    return await db
        .update(Threads)
        .set({lastPosted: new Date()})
        .where( eq( Threads.id, thread.id ) );
})

const ThreadsRepo = builder.build();

    
export default ThreadsRepo;