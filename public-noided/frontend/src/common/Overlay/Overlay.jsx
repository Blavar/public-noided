import {useEffect} from 'react';

import './Overlay.css'

export default function Overlay({children}){

    useEffect( () => {

        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        }
    }, [] )

    return (
        <div className='Overlay'>
            {children}
        </div>
    );
}