import {useState, useRef, useEffect} from 'react';
import { Link } from 'react-router-dom';

import {useUser} from '../contexts';
import {useUpdateAvatar} from '../contexts';

import {Button, DeleteButton} from '../common/Button';
import {Avatar} from '../Avatar';

import CropMenu from '../CropMenu'

import './Auth.css';


export default function UserMenu(){

    const [ showCropMenu, setShowCropMenu ] = useState(false);
    const [ avatarData, setAvatarData ] = useState(null);

    const {user} = useUser();
    const {subscribe} = useUpdateAvatar();

    const setImgButton = useRef(null);

    const unsubscribe = subscribe(  
        () => setImgButton.current('waiting'),
        () => {
            setImgButton.current('finished'),
            setTimeout( ()=>setImgButton.current('idle'), 3000 )
        },
        () => {
            setImgButton.current('error');
            setTimeout( ()=>setImgButton.current('idle'), 3000 );
        }
    )


    return (
        <div className='UserMenu'>
            <div className='row'>
                <Avatar username={user.username}/>
                <span className='username'>
                    {user.username}
                    </span>
            </div>

            <div className='row'>
                <Button value='image'
                    setRef={setImgButton}
                    onClick={()=>setShowCropMenu(true)}
                    />
                <span className='label'>
                    Change avatar
                    </span>
            </div>

            <div className='row'>
                <Button value='logout' />
                <span className='label'>
                    Logout
                    </span>                
            </div>

            { showCropMenu &&
                <CropMenu 
                    onClose={() => setShowCropMenu(false)}/>
            }
        </div>
        
    )
}