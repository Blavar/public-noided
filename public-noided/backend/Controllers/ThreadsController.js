import {UsersRepo, ThreadsRepo, PostsRepo} from '../Repos/index.js';

import { ResourceError, OwnershipError, ClientError, InternalError } from "../Errors/index.js";
import { AugmentError } from "../ErrorUtils/index.js";
import { ResourceInUseException } from '@aws-sdk/client-ssm';


let ThreadsController = {};

const TITLE_LIMIT = 200;
const CONTENT_LIMIT = 1500;

//verify requests

ThreadsController.GetThread = async ( req, res, next ) => {

    const {threadid} = req.params;
    let thread = await ThreadsRepo.readThread( {id: threadid} );
    if ( !thread ) throw new ResourceError('Thread doesn\'t exist');
    res.json( {thread: thread} );
}

ThreadsController.GetThreads = async ( req, res, next ) => {

    let threads = await ThreadsRepo.readThread();
    res.json( {threads: threads} );
}


ThreadsController.GetThreadPosts = async ( req, res, next ) => {

    const threadid = req.params.threadid;
    let posts = await PostsRepo.readThreadPosts( {thread: threadid} );
    if ( !(posts?.length > 0) ) throw new InternalError( "Thread is empty, apparently" );
    res.json( {posts: posts} );
}


// = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =
//Auhtorized methods

const verifyPostContent = ( post ) => {

    let errPost = '';

    if ( !post?.content ) errPost = 'Post cannot be empty';
    else if ( post.content.length > CONTENT_LIMIT ) errPost = `Post can have at most ${CONTENT_LIMIT} characters`;

    return errPost;
}


async function verifyPostOwner( reqPost ){

    let dbPost = await PostsRepo.readPost( {id: reqPost.id} );
    return dbPost?.user === reqPost.user;
}



ThreadsController.CreateThread = async (req, res, next) => {

    //user guaranteed by Auth
    const user = req.user;
    let {thread, post} = req.body;

    let errPost = ''
    let errThread = '';

    //this sanitization library would be really nice right now
    //but either way, replicating this schema in the future might be a good idea
    if( !( thread && post?.user ) ) throw new ResourceError( 'Invalid thread data' )
    if( !( post && post?.user ) ) throw new ResourceError('Invalid post data');

    if ( thread.user !== post.user ) throw new ResourceError( 'Non matching ownership on new thread' );

    if ( !thread?.title ) errThread = 'Write a title, please';
    else if ( thread.title.length > TITLE_LIMIT ) errThread = `Title can have at most ${TITLE_LIMIT} characters`;

    errPost = verifyPostContent( post );
 
    if ( errPost || errThread ) throw new ResourceError( "Bad new thread data", { thread: errThread, post: errPost } );


    let newThread = await ThreadsRepo.createThread({ 
        user: thread.user, 
        title: thread.title
    });

    let newPost = await PostsRepo.createPost({
        thread: newThread.id,
        user: post.user,
        content: post.content
    })

    res.json( {thread: newThread} );
}


ThreadsController.CreatePost = async ( req, res, next ) => {

    let {post} = req.body;
    if (!post) throw new ResourceError('Post missing on creation');
        
    const errPost = verifyPostContent( post );
    if ( errPost ) throw new ResourceError( 'Bad post content', errPost );

    let newPost = await PostsRepo.createPost(post);
    await ThreadsRepo.updateLastPosted( {id: post.thread} );
    
    res.json({post: newPost});
}


ThreadsController.EditPost = async ( req, res, next ) => {

    const user = req.user;
    const {post} = req.body;
    if (!post) throw new ResourceError('Post missing on creation');

    const errPost = verifyPostContent( post );
    if ( errPost ) throw new ResourceError( 'Bad post content', errPost );

    let legit = await verifyPostOwner( post );
    if (user.role === 'admin') legit = true;
    if (!legit) throw new ResourceError('Post not belonging to user')

    //delete timestamps to make drizzle happy
    delete post.created;
    delete post.edited;

    let editedPost = await PostsRepo.updatePost( post );
    await ThreadsRepo.updateLastPosted( {id: post.thread} );

    res.send({post: editedPost});
}

//!!!
ThreadsController.DeletePost = async ( req, res, next ) => {

    const user = req.user;
    const {postid} = req.params;

    let post = await PostsRepo.readPost( {id: postid} );
    let legit = await verifyPostOwner( post );

    if (user.role === 'admin') legit = true;
    if (!legit) throw new ResourceError('Post not belonging to user')

    await PostsRepo.deletePost( {id: post.id} );

    res.send();
}

export default ThreadsController;


