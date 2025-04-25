import {Button} from '../common/Button';
import { Link } from 'react-router-dom';

import './Auth.css'

export default function Auth(){
    
    return (
        <div className='AuthMenu'>
            <div className='row'>
                <Link to={'/login'} className='Link'>
                    <Button value='login'/>

                </Link>
                <span className='username'>
                        Login
                </span>

            </div>
            <div className='row'>
                <Link to={'/register'} className='Link'>
                    <Button value='app_registration'/>

                </Link>
                <span className='label'>
                        Register
                </span>

            </div>
            
        </div>
    )
}