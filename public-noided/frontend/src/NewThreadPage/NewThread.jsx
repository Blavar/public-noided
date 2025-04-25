import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import {useUser} from "../contexts"

import {api} from '../utils';

import PostFactory from "../ThreadPage/PostFactory.jsx"
import Editable from "../ThreadPage/Editable.jsx";

import './NewThread.css';
import '../ThreadPage/Post.css';

export default function NewThread(){

    const navigate = useNavigate();
    const {user} = useUser();

    const content = useRef('');
    const title   = useRef('');
    const [error, setError] = useState('');

    const onContentChange = (e) => content.current = e.target.value;
    const onTitleChange = (e) => title.current = e.target.value;


    useEffect( () => {
        if(!user) navigate('/error', {state: {details: ['Clever, are we?']}});
    }, [user] )

    const onSend = async () => {

        try {
            const requestData = {
                thread: {
                    title: title.current,
                    user: user.username
                },
                post: {
                    user: user.username,
                    content: content.current
                }
            }
            let [res, err] = await api.post( '/auth/thread', requestData );

            if ( res ){
                const {thread: newThread} = res.data;
                navigate( `/thread/${newThread.id}` );
            } else if(err) {

                const feedback = err?.uiFeedback;

                if (feedback?.post) setError( feedback.post );
                else if (feedback?.thread) setError( feedback.thread );
            }
        } catch(err) {

            setError('Something went wrong');
        }
    }

    return (
    <>
    {   user &&
        <div className="NewThreadBox">
            <div className="NewThread"> 
                <div className="titleBox">
                    <Editable
                        editMode={true}
                        placeholder="Write a good title"
                        onChange={onTitleChange}
                    />
                </div>
                <PostFactory isOP={true}
                    className='OP'
                    post={ {user: user.username, content: ''} }
                    error={error}
                    showSend={true}
                    editMode={true} 
                    onSend={onSend}
                    onChange={onContentChange}
                />
            </div>
        </div>
    }
    </>

    )
}