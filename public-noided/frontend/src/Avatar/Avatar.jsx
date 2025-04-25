import { useState, useEffect } from 'react';
import {useUser} from '../contexts';
import {useUpdateAvatar} from '../contexts';

export default function Avatar({username='_'}){

    const static_url = import.meta.env.VITE_STATIC_URL;
    const defaultSrc = `${ static_url }/_.jpg`;

    const {updateKey} = useUpdateAvatar();
    const {user} = useUser();

    const [isOwner, setIsOwner] = useState(false);
    const [src, setSrc] = useState(defaultSrc);

    

    useEffect( () => {
        const owner = (user && user.username === username)
        setSrc( `${ static_url }/${username}.jpg` );
        setIsOwner( owner );
    }, [user])

    const onError = (e) => {
        e.target.onerror = null;
        e.target.src = defaultSrc;
    }

    return (
        <span className='Avatar'>   
            <img src={src + ( isOwner ? `?${updateKey}` : '' )}
                onError={onError}
            
            >
            </img>
        </span>
    )
}