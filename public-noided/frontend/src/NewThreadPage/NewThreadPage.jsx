import { useThread } from "../contexts"

import NewThread from "./NewThread.jsx";
import { Button } from '../common/Button';

import './NewThreadPage.css'

export default function NewThreadPage(){

    return (
        <div className="NewThreadPage">
            <NewThread/>
        </div>
    )
}