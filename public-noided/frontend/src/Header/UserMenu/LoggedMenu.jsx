import {useState, useRef, useEffect} from 'react';
import { Link } from 'react-router-dom';

import {useUser} from '../../contexts';
import {useUpdateAvatar} from '../../contexts';

import {MenuItem} from '../../common/MenuItem';
import {Button} from '../../common/Button';
import {Avatar} from '../../Avatar';

import { api } from '../../utils';

import CropMenu from '../../CropMenu'

import './LoggedMenu.css';

//Move update avatar to main !!! otherwise avatars wont update


export default function LoggedMenu(){

    const {user, resetUser} = useUser();

    const [ showCropMenu, setShowCropMenu ] = useState(false);

    const onLogout = async () => {
        let [res, err] = await api.post( '/logout' );
        ///!
        resetUser();
    }

    return (
        <div className='LoggedMenu'>

            <div className='userBox'>
                <Avatar username={user.username}/>
                <span className='username'>
                    {user.username}
                </span>
            </div>
            <MenuItem 
                title='Change avatar'
                icon='image' 
                onClick={ () => setShowCropMenu(true) }
            />
            <MenuItem 
                title='Logout' 
                icon='logout'
                onClick={ onLogout }
                />

            { showCropMenu &&
                <CropMenu 
                    onClose={() => setShowCropMenu(false)}/>
            }
        </div>
        
    )
}

/*

    const [ showCropMenu, setShowCropMenu ] = useState(false);
    const [ avatarData, setAvatarData ] = useState(null);

    const {user, resetUser} = useUser();
    const {subscribe} = useUpdateAvatar();

    const setImgAction = useRef(null);
    const setLogoutAction = useRef(null);

    const unsubscribe = subscribe(  
        () => setImgAction.current('waiting'),
        () => {
            setImgAction.current('finished'),
            setTimeout( ()=>setImgAction.current('idle'), 3000 )
        },
        () => {
            setImgAction.current('error');
            setTimeout( ()=>setImgAction.current('idle'), 3000 );
        }
    )

    const onLogout = async () => {
        let [res, err] = await api.post( '/api/logout' );

        resetUser();
    }

        <div className='LoggedMenu'>
            <Label icon='person' title='Login'/>

            <div className='row'>
                <Avatar username={user.username}/>
                <span className='username'>
                    {user.username}
                </span>
            </div>

            <Action  
                name='Change avatar'
                value='image'
                onClick={ () => setShowCropMenu(true) }
                setRef={ setImgAction }
            />
            <Action 
                name='Logout'
                value='logout'
                onClick={ onLogout }
                setRef={ setLogoutAction }
            />

            { showCropMenu &&
                <CropMenu 
                    onClose={() => setShowCropMenu(false)}/>
            }
        </div>
*/