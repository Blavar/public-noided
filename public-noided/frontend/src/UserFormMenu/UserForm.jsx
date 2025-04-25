import { useRef, useState, useEffect } from "react";

import {useUser} from '../contexts/index.js';

import { Turnstile } from '@marsidev/react-turnstile';
import FormField from "./FormField.jsx";
import {Button} from '../common/Button/index.js';
import {Action} from '../common/Action/index.js';

import {api} from '../utils/index.js';

import './UserForm.css';

//Actions have a problem with empty refs

export default function UserForm({title, route, onSuccess, onClose}){

    const token = useRef(null);

    const setSendAction = useRef(null);
    const onSend = useRef(null);

    const username = useRef(null);
    const password = useRef(null);

    const [turnstileKey, setTurnstileKey] = useState(0);

    const [formError, setFormError] = useState({username: '', password: ''});

    useEffect( () => {

        return () => {

            token.current = null;

            username.current = null;
            password.current = null;
    
            setTurnstileKey(0);
            setFormError( {username: '', password: ''} );

            onSend.current = null;
        }

    }, []);


    const onTurnstileSuccess = (turnstileResponse) => {
        token.current = turnstileResponse;
        setSendAction.current('idle');
    }
    const onTurnstileError = (turnstileResponse) => {
        token.current = '';
        setSendAction.current('locked');
    }
    const onTurnstileExpire = () => {
        token.current = '';
        setSendAction.current('locked');
        setTurnstileKey( turnstileKey => turnstileKey+1 );
    }


    onSend.current = async () => {

        setSendAction.current('waiting');

        if (!token.current) {

            setSendAction.current('alert', 'Verification failed');
            return;
        }

        const userData = {
            username: username.current,
            password: password.current
        }

        let [res, err] = await api.post( route, {
            turnstileResponse: token.current,
            user: userData
        });

        if (res) {
            onSuccess( res.data.user );

            setSendAction.current('finished');
            setTimeout( () => onClose(), 4000 );

        } else if(err) {

            if ( err.uiFeedback ){

                setFormError( err.uiFeedback );
                setSendAction.current('alert');
            }
            else {
                setSendAction.current( 'alert', err.data )
            }
            setTurnstileKey( turnstileKey => turnstileKey+1 );
        }
    }


    return (
        <div className="UserForm">
            <h1 className="title">{title}</h1>
            <FormField
                icon='person'
                type='text'
                placeholder='username'
                error={formError.username}
                onChange={(e) => username.current = e.target.value}
            />
            <FormField
                icon='password'
                type='password'
                placeholder='password'
                error={formError.password}
                onChange={ (e) => password.current = e.target.value }
            />
            <div className="turnstile">
                <Turnstile
                    siteKey={import.meta.env.VITE_CLOUDFLARE_SITEKEY}
                    onSuccess={onTurnstileSuccess}
                    onExpire={onTurnstileError}
                    onError={onTurnstileExpire}
                    options={{
                        theme: 'dark',
                        language: 'en'
                    }}
                    size='compact'
                    key={turnstileKey}
                />
            </div>
            <Action
                value='double_arrow'
                name='Submit'
                status="locked"
                setRef={setSendAction}
                onClick={onSend.current}
            />
        </div>

    )
}

/*
            if( err.data.username || err.data.password ){
                setErrUsername(err.data.username);
                setErrPassword(err.data.password);
            } else {
                setSendAction.current( 'alert', err.data );
            }
*/