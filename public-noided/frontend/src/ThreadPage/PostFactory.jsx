import { useState, useRef, useEffect } from "react";

import {Avatar} from "../Avatar/index.js";
import Editable from "./Editable.jsx";
import { Action } from "../common/Action/index.js";

import { EditButton, DeleteButton } from "../common/Button/index.js";

import './Post.css';

export default function PostFactory({
    className='',
    post, 
    error='',
    showEdit=false, 
    showDelete=false, 
    showSend=false, 
    editMode=false, 
    onEdit=null,
    onDelete=null,
    onSend=null,
    onChange=null}){

    const dummyRef = useRef(null);

    return (
        <div className={("Post " + className)}>
            <Avatar username={post.user}/>
            <div className="body">
                <div className="head">
                    <span className="username">{post.user}</span>
                    <span className="postActions">
                        {   showEdit &&
                            <EditButton
                                value='edit'
                                onClick={onEdit}
                            />
                        }
                        {   showDelete&&
                            <DeleteButton
                                value='delete'
                                onClick={onDelete}
                            />
                        }
                    </span>
                    <span className="error">{error}</span>

                </div>
                
                <Editable
                    content={post.content}
                    editMode={editMode}
                    onChange={onChange}
                />
                {   showSend &&
                    <div className="sendAction">
                        <Action
                            value='double_arrow'
                            name='SEND'
                            onClick={onSend}
                            setRef={dummyRef}
                        />
                    </div>
                }
            </div>
        </div>
    )
}