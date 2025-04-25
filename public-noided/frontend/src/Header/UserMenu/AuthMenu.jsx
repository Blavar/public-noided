import { useState, useRef } from 'react';

import { useUser } from '../../contexts';

import { Avatar } from '../../Avatar';
import {MenuItem} from '../../common/MenuItem';
import {Action} from '../../common/Action';
import UserFormMenu from '../../UserFormMenu';

import './AuthMenu.css'

export default function Auth(){

    const {updateUser} = useUser();
    
    const [showLoginMenu, setShowLoginMenu] = useState(false);
    const [showRegisterMenu, setShowRegisterMenu] = useState(false);

    //onsucces, onclose, onclick
    const onLogin = user => updateUser(user);
    const onRegister = user => updateUser(user);

    return (
        <div className='AuthMenu'>
            <div className='userBox'>
                <Avatar username={'-'}/>
                <span className='username'>
                    {' '}
                </span>
            </div>
            <MenuItem
                title='Login'
                icon='login'
                onClick={ () => setShowLoginMenu(true) }
            />
            <MenuItem
                title='Register'
                icon='app_registration'
                onClick={ () => setShowRegisterMenu(true) }
            />

            {   showLoginMenu &&
                <UserFormMenu
                    title='Login'
                    route='/login'
                    onSuccess={onLogin}
                    onClose={ () => setShowLoginMenu(false) }
                />
            }
            {   showRegisterMenu &&
                <UserFormMenu
                    title='Register'
                    route='/register'
                    onSuccess={onRegister}
                    onClose={ () => setShowRegisterMenu(false)}
                />
            }


        </div>
    )
}