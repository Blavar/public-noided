import UserMenu from "./UserMenu/index.js";
import Logo from "./Logo.jsx";

import './Header.css';

export default function Header(){

    return (
        <div className="Header">
            <UserMenu/>
            <Logo/>
        </div>
    )
}