import {useState, useRef, useEffect} from 'react';

import './Button.css'

//A button component that works like a state machine
//parent can change it's behaviour and appearance through
//the set ref, which is connected to its state setter
export default function Button({value, status='idle', onClick, setRef=null}){

    const reset = useRef(null);

    //in the future - distinguish between type and state
    // as in a normal button can be in alert or locked state
    // or an edit button can be toggled and alert, etc.

    const statuses = {
        'idle': {
            status:         'idle',
            value:          value,
            onClick:        onClick,
            onAnimationEnd: null        
        },
        'alert': {
            status:         'alert',
            value:          value,
            onClick:        onClick,
            onAnimationEnd: () => {reset.current()}
        },
        'waiting': {
            status:         'waiting',
            value:          value,
            onClick:        null,
            onAnimationEnd: null
        },
        'finished': {
            status:         'finished',
            value:          value,
            onClick:        null,
            onAnimationEnd: null        
        },
        'locked': {
            status:         'locked',
            value:          value,
            onClick:        null,
            onAnimationEnd: null
        },
        'error': {
            status:         'error',
            value:          value,
            onClick:        null,
            onAnimationEnd: null        
        }
    }

    const [state, setState] = useState( () => statuses[status] );

    useEffect( ()=> {
        reset.current = () => { setState( statuses['idle'] ) }

        //If anything breaks, it prolly starts here
        if (setRef) setRef.current = (_status) => { setState( statuses[_status] )}
        
        // return () => {
        //     reset.current = null;
        // }
    }, [setRef])


    return (
        <span className='Button'>
            <button 
                className={'material-icons '+ ( state.status )}
                onClick={ state.onClick }
                onAnimationEnd={ state.onAnimationEnd }
            > {state.value}
            </button>
        </span>
    )
}
