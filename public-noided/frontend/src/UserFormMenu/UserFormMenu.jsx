import UserForm from "./UserForm";
import { Overlay } from "../common/Overlay";

import { DeleteButton } from "../common/Button";

import './UserFormMenu.css'

export default function UserFormMenu(props){

    const {onClose, ...rest} = props;

    return (
        <Overlay>
            <div className="UserFormMenu">
                <UserForm {...props}/>
                <DeleteButton
                    value='close'
                    onClick={onClose}
                />
            </div>
        </Overlay>
    )
}