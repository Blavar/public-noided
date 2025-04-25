import { useUser } from "../../contexts/index.js";

import AuthMenu from "./AuthMenu.jsx";
import LoggedMenu from "./LoggedMenu.jsx";

import './UserMenu.css';

export default function UserMenu(){

    const {user} = useUser();

    return (
        <div className="UserMenu" >
            { !user &&
                <AuthMenu/>
            }
            { user &&
                <LoggedMenu/>
            }
        </div>
    )
}