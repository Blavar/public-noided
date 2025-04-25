import {useState, useRef, useEffect} from 'react';

import {Button} from '../Button';
import './Action.css'

export default function Action({ value, name, status='idle', onClick, setRef}){


    const [error, setError] = useState('');
    const setButton = useRef(null);

    useEffect( ()=> {

        setRef.current = ( argStatus, argError='' ) => {
            setButton.current( argStatus );
            setError(argError);
        }
        
        // return () => {
        //     setButton.current = null;
        // }

    }, [ setButton.current ]);


    return (
        <div className='Action'>
            <div className='gridBox'>

                <Button 
                    value={value}
                    status={status}
                    onClick={onClick}
                    setRef={setButton}  
                    />
                
                <div className='name'>{name}</div>
                <div/>
                <div className='actionerror'>{error}</div>
            </div>
        
        </div>
    )
}