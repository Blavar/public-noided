import { useState } from 'react';

import './Button.css'

export default function EditButton ( {value, onClick} ){

    const [toggle, setToggle] = useState(false);

    const handleClick = () => {

        onClick( !toggle );
        setToggle( !toggle );
    }

    return (
        <div className='Button'>
            <button className={'material-icons edit ' + (toggle ? 'on' : 'off') }
                onClick={ handleClick }
            > {value}
            </button>
        </div>
    )
}