import { useState, useEffect } from "react"

import { useUser } from "../contexts/index.js";
import { useThread } from '../contexts';

import Post from "./Post.jsx";
import NewPost from "./NewPost.jsx";
import LockedPost from "./LockedPost.jsx";

import './Thread.css';

export default function Thread(){

    const {user} = useUser();

    const { thread, posts } = useThread();

    return (
        <div className='ThreadBox'>
            <div className='Thread'>
                <div className="titleBox">
                    {thread &&
                        <span className='title'> {thread.title} </span>
                    }
                </div>
                
                {   posts && 
                <>
                    {   posts[0] &&
                        <Post
                            key={posts[0].id}
                            post={posts[0]}
                            isOP={true}
                        />
                    }
                    <div className="replies">
                        {   posts.slice(1).map( post => (

                            post.id && 
                            <Post
                                key={post.id}
                                post={post}
                            />

                        ))}
                    </div>

                    <NewPost/>
                </>
                }
            </div>
        </div>
    )
}