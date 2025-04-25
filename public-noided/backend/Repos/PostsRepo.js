import {db} from '../platform/index.js';
import RepoBuilder from './RepoBuilder.js';

import { eq, lt, gte, ne, asc } from 'drizzle-orm';

import {Posts} from '../drizzle/schema.js';

const builder = new RepoBuilder(Posts);
builder.buildCRUD();
builder.buildMethod( 'readThreadPosts', async ( post ) => {
    return await db
        .select()
        .from(Posts)
        .where( eq( Posts.thread, post.thread ))
        .orderBy( asc( Posts.created ) )
});

const PostsRepo = builder.build();

export default PostsRepo;