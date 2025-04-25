import {useState, useContext, useEffect, useCallback} from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import ThreadContext from './ThreadContext.js';

import {axiosInstance} from '../utils/index.js';
import {api} from '../utils/index.js';

//only rendered if user exists to begin with
/**
 * In a ThreadPage component, handles CRUD requests for the posts, 
 * updates the posts state array on success, on failure provides
 * the appropiate post with an error message
 */
export default function ThreadProvider({children}){

    const navigate = useNavigate();

    const {threadid} = useParams();

    const [thread, setThread]   = useState(null);
    const [posts, setPosts]     = useState(null);

    const [errors, setErrors]   = useState({});
    const [newPostError, setNewPostError] = useState('');


    const getFeedback = (err) => {
        return err?.uiFeedback ? err.uiFeedback : "Something went wrong";
    }


    //fetch the data
    useEffect( () => {
        (async () => {
            try {
                let res, err;
                
                [res, err] = await api.get(`/threads/${threadid}`);
                setThread(res.data.thread);

                [res, err] = await api.get(`/threadposts/${threadid}`);
                setPosts( res.data.posts );
            } catch {
                navigate( '/' );
            }
        })()

    }, [threadid]);


    useEffect( () => {

        if(posts){
            setErrors( (errors) => {
                return posts.reduce( (newErrors, post) => {
                    if ( errors[post.id] ) newErrors[post.id] = errors[post.id];
                    return newErrors;
                })
            }, {} );
        }
    }, [posts]);

    
    const updateError = (postId, newError) => {
        setErrors( (errors) => ({
            ...errors,
            [postId]: newError,
        }))
    }


    const requestCreate = useCallback( async (reqPost, onSuccess) => {

        const postData = {
            thread: threadid,
            user: reqPost.user,
            content: reqPost.content
        }

        let [res, err] = await api.post( '/auth/post', {post: postData} );
        if(res){

            const { post: newPost } = res.data;
            setPosts( posts => [...posts, newPost] );
            onSuccess();
        } else if(err) {
            setNewPostError( getFeedback( err ) );
        }
    }, [posts])


    const requestEdit = useCallback( async (reqPost) => {

        let [res, err] = await api.put( `/auth/post/${reqPost.id}`, {post: reqPost} );
        if(res){
            
            const { post: editedPost } = res.data;
            setPosts( posts.map( post => {
                if( post.id === editedPost.id ) return { ...post, ...editedPost };
                return post;
            }))
            updateError( reqPost.id, '' );

        } else if(err) {
            updateError( reqPost.id, getFeedback( err ) );
        }

    }, [posts])

    const requestDelete = useCallback( async (reqPost) => {

        let [res, err] = await api.delete( `/auth/post/${reqPost.id}` );
        
        if (res) setPosts(posts.filter((post) => post.id !== reqPost.id));
        else if(err){
            updateError( reqPost.id, getFeedback( err ) );
        }
    
    }, [posts])

    const contextValue = {
        thread,
        posts,
        errors,
        newPostError,
        requestCreate,
        requestEdit,
        requestDelete
    }

    return (
        <ThreadContext.Provider value={contextValue}>
            {children}
        </ThreadContext.Provider>
    )
}

