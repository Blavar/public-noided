import { useState } from 'react';

import './Button.css'

export default function EditButton ( {value, onClick} ){

    return (
        <div className='Button'>
            <button className={'material-icons delete'}
                onClick={ onClick }
            > {value}
            </button>
        </div>
    )
}