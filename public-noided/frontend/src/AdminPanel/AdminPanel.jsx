import { useState, useEffect } from "react";
import {useUser} from "../contexts";
import { api } from "../utils";

import {Avatar} from "../Avatar";

import './AdminPanel.css';

export default function AdminPanel(){

    const [isAdmin, setIsAdmin] = useState(false);
    //request admin credentials
    const {user, updateUser} = useUser();
    const [users, setUsers] = useState(null);

    useEffect( () => {

        (async () => {
            try {
                let [res, err] = await api.get( '/auth/admin/isAdmin' );
                const { isAdmin: result } = res.data;
                setIsAdmin( result );
            } catch {
                setIsAdmin(false);
            }
        })();


        // //handle auth errors

        //     (async () => {
        //         try {
        //             let [res,err] = await api.get( '/auth/admin/users' );
        //             setUsers( res.data.users );
        //         } catch {
        //             ;    
        //         }
        //     })();
        // }
    }, [user])

    useEffect( () => {

        if (isAdmin) {
            (async () => {
                try {
                    let [res, err] = await api.get( '/auth/admin/users');
                    const { users: result } = res.data;
                    setUsers( result );
                } catch {
                    setUsers(null);
                }
            })();
        }
    }, [isAdmin])

    const onClick = (user) => {
        updateUser(user);
    }

    return (
    <>
    {   ( user && isAdmin && users ) &&
            <div className="AdminPanel">
                {    users.map( user => (
                    <div className="AvatarBox" key={user.username} onClick={ () => onClick(user) }>
                        <Avatar 
                            
                            username={user.username}/>
                    </div>
                ))
                }
            </div>
    }
    </>
    )
}