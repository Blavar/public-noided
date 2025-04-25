import {useState} from 'react';
import { Link } from 'react-router-dom';

import { Avatar } from '../Avatar';

import './ThreadLabel.css';

export default function NewThreadLabel( {thread} ){

    return (
        <div className='ThreadLabel NEW'>
            <Avatar/>
            <Link className='Link' to={`/newthread`} >
                <div className="titleBox">
                    <span className='title'>
                        {"new thread"}
                    </span>
                </div>
            </Link>
        </div>
    )
}