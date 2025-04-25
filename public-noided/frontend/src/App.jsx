import { useState, useRef, useEffect, createContext } from 'react';
import { Routes, Route} from 'react-router-dom';

import {use429Handler} from './hooks';

import Header from './Header';
import ThreadListPage from './ThreadListPage';
import ThreadPage from './ThreadPage'
import NewThreadPage from './NewThreadPage';
import ErrorPage from './ErrorPage';
//!!!!!
import AdminPanel from './AdminPanel';

import './App.css';
import './index.css';


function App() {

    use429Handler();

    return (
    <>
        <Header/>
        <div className='AppBody'>
                <Routes>
                <Route path='/' element={ <ThreadListPage/> }/>
                <Route path='/thread/:threadid' element={ <ThreadPage/> }/>
                <Route path='/newthread' element={ <NewThreadPage/> } /> 
                <Route path='/error' element={ <ErrorPage/> } />
            </Routes>
        </div>
        <AdminPanel/>
    </>
    )
}

export default App
