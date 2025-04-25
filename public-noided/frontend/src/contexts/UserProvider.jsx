import {useState, useEffect, useCallback, useContext, createContext} from 'react';
import UserContext from './UserContext.js';

import {axiosInstance} from '../utils';

const _ = {
    username: '_',
    role: 'user'
}


export default function UserProvider({children}){

    const [user, setUser] = useState(null);

    //on app start, clear the local storage, try to fetch the user
    //the auhtentication error should prolly trigger reset here as well
    //maybe i can delegate the loggin in here even?
    //this would be really good
    const updateUser = useCallback( (newUser)=>{
        localStorage.setItem( "user", JSON.stringify( newUser ) )
        setUser(newUser);

    }, [])

    const resetUser = useCallback( () => {
        localStorage.removeItem("user");
        setUser(null);
    }, [])


    //
    useEffect( () => {
        const storedUser = localStorage.getItem("user");
        setUser( storedUser ? JSON.parse(storedUser) : null )
    }, [])


    //init
    useEffect(() => {

        //try to access a dummy authorized route in order to see if token is still valid
        //if not, reset the user data
        (async () => {
            try {
                await axiosInstance.get( '/auth/isAuth' );
            } catch(err) {
                resetUser();
            }
        })();

        //intercept request in order to detect 401 on bad token
        const interceptor = axiosInstance.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response && error.response.status === 401) resetUser();
                return Promise.reject(error); 
            }
        );
    
        return () => axiosInstance.interceptors.response.eject(interceptor);
    }, []);


    const contextValue = {
        user,
        updateUser,
        resetUser,
    }

    return (
        <UserContext.Provider value={contextValue}>
            {children}
        </UserContext.Provider>
    )
}

