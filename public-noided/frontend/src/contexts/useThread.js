import {useContext} from 'react';

import ThreadContext from './ThreadContext.js'

export default function useUser(){
    return useContext(ThreadContext);
}
