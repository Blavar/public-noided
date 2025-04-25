import { useContext } from 'react';

import UpdateAvatarContext from './UpdateAvatarContext.js';

export default function useUpdateAvatar(){
    return useContext( UpdateAvatarContext );
}

