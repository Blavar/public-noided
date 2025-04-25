import { useLocation } from "react-router-dom";

import './ErrorPage.css';

export default function ErrorPage(){

    const location = useLocation();

    const {details} = location?.state;

    return (
        <div className="ErrorPage" >
            <div className="detailsBox">
                {   details && details.map( (item, index) => (
                        <div className="message" key={index}>{item}</div>
                ))}           
            </div>
        </div>
    )
}