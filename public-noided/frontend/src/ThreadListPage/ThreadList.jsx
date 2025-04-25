import {useState, useEffect} from 'react';

import { useUser } from '../contexts/index.js';
import { api } from '../utils/index.js';

import ThreadLabel from './ThreadLabel.jsx';
import NewThreadLabel from './NewThreadLabel.jsx';

import './ThreadList.css'

export default function ThreadList(){

    const { user } = useUser();
    const [threads, setThreads] = useState();

    useEffect( () => {
        //hanlde errors
        (async () => {
            let [res, err] = await api.get('/threads');
            if ( res ) setThreads( res.data.threads );
            else ;//error page
        })();
    }, [])

    //if user, 

    return (
        <div className='ThreadList'>
            { threads && (threads.map( thread => (
                <ThreadLabel key={thread.id} thread={thread}/>
            )))}
            {   user &&
                <NewThreadLabel/>
            }
        </div>
    )


}