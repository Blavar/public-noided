import { Icon } from "../Icon";

import './MenuItem.css';

export default function MenuItem({icon, title, onClick=null}){

    return (
        <div className="MenuItem" onClick={onClick}>

            <Icon value={icon}/>
            <span className="title">{title}</span>
        </div>
    )
}