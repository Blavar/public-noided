import {useContext} from 'react';

import UserContext from './UserContext.js'

export default function useUser(){
    return useContext(UserContext);
}
