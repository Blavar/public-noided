import { useState, useEffect } from "react"

import Textarea from 'react-textarea-autosize';
import './Editable.css';

export default function Editable({content, editMode, onChange, placeholder=''}){

    const [localContent, setLocalContent] = useState(content);

    const localOnChange = (e) => {
        const value = e.target.value;
        setLocalContent( value )
        onChange(e);
    }

    return (
        <div className="Editable">
            <div className="contentBox">
                {   !editMode && 
                    <div className='content'>
                        {localContent}
                    </div>
                }
                {  editMode &&
                    <Textarea className='textarea'
                        spellCheck='false'
                        value={localContent}
                        placeholder={placeholder}
                        onChange={localOnChange}
                    />
                }
            </div>
        </div>
    )
}