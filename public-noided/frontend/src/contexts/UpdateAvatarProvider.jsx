import {useState, useRef, useCallback, useContext, useEffect} from 'react';

import UpdateAvatarContext from './UpdateAvatarContext.js';
import useUser from './useUser.js';

import {api} from '../utils';

/**
 * Manages context of sending a request to update a logged user's avatar and informs the interested component 
 * if an update happenned through subscribed callback or updateKeys. Callbacks are used by the UserMenu and cropMenu
 * updateKey is used by the UserAvatar component, which attaches the key to the avatar url as a query
 * triggering an update
 */
export default function UpdateAvatarProvider({children}){

    //has to globally manager the update key
    const {user} = useUser();
    const reqUrl = useRef(null);

    const [updateKey, setUpdateKey] = useState(0);

    const onSendMap = useRef(null);
    const onResMap = useRef(null);
    const onErrMap = useRef(null);
    const idx = useRef(0);

    useEffect( ()=>{
        if( user ) {
            reqUrl.current = `/auth/avatar/${user.username}`;
            const storedKey = localStorage.getItem( `${user.username}key` );

            if (storedKey) setUpdateKey( Number(storedKey) );
        }

        onSendMap.current = new Map();
        onResMap.current = new Map();
        onErrMap.current = new Map();

        idx.current = 0

    }, [user])

    const subscribe = useCallback( (onSend, onRes, onErr) => {

        idx.current++;
        const i = idx.current;
        onSendMap.current.set(i, onSend);
        onResMap.current.set(i, onRes);
        onErrMap.current.set(i, onErr);

        //return unsubscribe callback
        return () => {
            onSendMap.current.delete(i, onSend);
            onResMap.current.delete(i, onRes);
            onErrMap.current.delete(i, onErr);
        }
    }, [])


    const updateAvatar = useCallback( async ( data ) => {
        for( const cb of onSendMap.current.values() ) cb();

        let [res, err] = await api.put( reqUrl.current , {
            user: user.username,
            data: data}
        )

        if (res){
            for ( const cb of onResMap.current.values() ) cb();

            localStorage.setItem( `${user.username}key`, updateKey+1 );
            setUpdateKey( updateKey+1 );
        }
        else if (err) for( const cb of onErrMap.current.values() ) cb();
    }, [user, updateKey])


    const contextValue = {
        updateAvatar,
        subscribe,
        updateKey
    }

    return (
        <UpdateAvatarContext.Provider value={contextValue}>
            {children}
        </UpdateAvatarContext.Provider>
    )
}

