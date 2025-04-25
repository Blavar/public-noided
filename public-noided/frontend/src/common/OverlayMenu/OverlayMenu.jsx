import {Overlay} from '../Overlay';
import {DeleteButton} from '../Button';

import './OverlayMenu.css';

export default function OverlayMenu({children, onClose}){

    return (
        <div className='OverlayMenu'>
            <Overlay>
                {children}
                <DeleteButton
                    value='close'
                    onClick={onClose}
                />
            </Overlay>
        </div>
    )
}