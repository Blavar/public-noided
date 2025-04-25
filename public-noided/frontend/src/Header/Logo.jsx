import { Link } from 'react-router-dom';

import './Logo.css';

export default function Logo(){

    const title = [...'noided'];

    const style = (index) => {
        const delay = index*10;
        return {
            animationDelay: `${delay}s`
        }
    }

    return (
        <div className='LogoBox'>
            <Link className="Logo Link" to='/'>
                {   title.map( (letter, index) => (
                    <div  key={index} className="letter" style={ style(index) }>
                        {letter}
                    </div>
                    ))
                }
            </Link>
        </div>
    )
}