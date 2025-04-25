import { useState, useRef, useEffect } from "react";
import { useUser, useThread }  from "../contexts";

import PostFactory from "./PostFactory.jsx";

export default function Post({ post, isOP=false}) {
    
    const { requestEdit, requestDelete, errors } = useThread();

    const {user} = useUser();
    const [isOwner, setIsOwner] = useState(false);

    const [error, setError] = useState('');    
    const [editMode, setEditMode] = useState(false);
    const content = useRef( post.content );

    const className = isOP ? " OP" : "";

    //= = = = = = = = = = = = = = = = = = = = = = = = 

    useEffect(() => {
      setIsOwner( ( user?.username === post.user ? true : false) );
    }, [user]);

    useEffect( () => {
      setError( errors[post.id] );
    }, [errors]);
  
  
    const onEdit = () => {
      if( editMode ){
          const postData = {
            id: post.id,
            user: post.user,
            content: content.current
          }
          requestEdit( postData );
      }
      setEditMode( !editMode );
    }

    const onDelete = () => requestDelete( post );

    const onChange = (e) => content.current = e.target.value;
    


    return (
      <>
        { isOwner &&
          <PostFactory className={className}
            post={post} 
            error={error}
            showEdit={true} 
            showDelete={ !isOP }
            editMode={editMode}
            onEdit={ onEdit }
            onDelete={ onDelete }
            onChange={ onChange }
          />
        }
        { !isOwner &&
          <PostFactory className={className}
            post={post}
          />
        }
      </>
      );
  }


        // <Post
        //   post={post}
        //   className={(isOP ? " OP" : "") + (isNewPost ? " NEW" : "")}
        //   isOP={isOwner}
        //   isEditable={showEdit}
        //   isDeletable={showDelete}
        //   isSendable={showSend}
        //   isEditMode={isEditMode}
        //   onSend={onSend}
        // />