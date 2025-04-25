import { Icon } from '../common/Icon';

import './FormField.css';

export default function FormField({icon, type, placeholder, error, onChange}){

    return (
        <div className="FormField">
            <Icon value={icon}/>
            <input className='input'
                type={type}
                placeholder={placeholder}
                onChange={ onChange }
                />
            <div/>
            <div className='error'>
                {error}
            </div>
        </div>
    )
}