import { useState } from 'react';

import './Button.css'

export default function ToggleButton ( props ){

    const [toggle, setToggle] = useState(false);

    const handleClick = () => {

        props.onClick( !toggle );
        setToggle( !toggle );
    }

    return (
        <button className={'material-icons Button toggle ' + (toggle ? 'on' : 'off') }
            onClick={ handleClick }
        > {props.value}
        </button>
    )
}