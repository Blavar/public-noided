import {useState} from 'react';
import { Link } from 'react-router-dom';

import {Avatar} from '../Avatar';

import './ThreadLabel.css';

export default function ThreadLabel( {thread} ){

    //thread - title, user

    return (
        <div className='ThreadLabel'>
            <Avatar 
                username={thread.user}
            />
            <Link className='Link' to={`/thread/${thread.id}`} >
                <div className="titleBox">
                    <span className='title'>
                        {thread.title}
                    </span>
                </div>
            </Link>
        </div>
    )
    //create a new thread
}