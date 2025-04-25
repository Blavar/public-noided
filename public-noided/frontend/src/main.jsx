import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { BrowserRouter } from 'react-router-dom';

import { UserProvider } from './contexts';
import {UpdateAvatarProvider} from './contexts';

import App from './App.jsx'

createRoot(document.getElementById('root')).render(
    <StrictMode>
            <BrowserRouter>
                <UserProvider>
                    <UpdateAvatarProvider>
                        <App />
                    </UpdateAvatarProvider>
                </UserProvider>
            </BrowserRouter>
    </StrictMode>,
)
