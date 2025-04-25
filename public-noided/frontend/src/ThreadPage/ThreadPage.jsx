import { ThreadProvider } from "../contexts";
import Thread from "./Thread.jsx";


export default function ThreadPage(){

    return(
        <ThreadProvider>
            <Thread/>
        </ThreadProvider>
    )
}