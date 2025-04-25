import { useState, useRef, useEffect, useCallback } from 'react';

import { useUser } from '../contexts/index.js';
import { useThread } from '../contexts/index.js';

import PostFactory from "./PostFactory.jsx";
import LockedPost from "./LockedPost.jsx";

import {Button} from "../common/Button";

export default function NewPost({isOP=false}){

    const { requestCreate, newPostError } = useThread();
    const { user } = useUser();
    //chekc if user
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [error, setError] = useState('');
    const content = useRef('');
    const post = useRef('');

    const dummyRef = useRef(null);
    const [showNew, setShowNew] = useState(false);

    useEffect( () => {
        setIsLoggedIn( user ? true : false );
        if (user) post.current = {
            user: user.username,
            content: ''
        }

    }, [user]);


    useEffect( () => {
        setError( newPostError );
    }, [newPostError]);

    const onSuccess = () => {
        setError('');
        content.current = '';
        setShowNew(false);
    }

    const onSend = ()=>{

        const postData = {
            user: user.username,
            content: content.current
        }

        requestCreate( postData, onSuccess );
    }

    const onChange = (e) => content.current = e.target.value;

    return (
    <>
    {/*on container click activate*/}
    {   user && showNew &&
        <PostFactory className={ isOP ? " OP" : "" }
            post={ { user: user.username, cotnent: '' } }
            error={error}
            showSend={true} 
            editMode={true} 
            onSend={onSend}
            onChange={onChange}/>
    }
    {   user && !showNew &&
        <div className='addButton'>
            <Button
                value='add'
                setRef={dummyRef}
                onClick={ () => setShowNew(true) }
            />
        </div>
    }


    {/* blank post sending to login */}
    {   !user &&
        <LockedPost/>
    }
    </>
    )
}