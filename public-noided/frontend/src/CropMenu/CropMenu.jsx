import { useState, useRef, useEffect, useCallback } from 'react';

import {useUser} from '../contexts';
import {useUpdateAvatar} from '../contexts';

import {Overlay} from '../common/Overlay';
import Crop from './Crop.jsx';
import {Button, DeleteButton} from '../common/Button';
import {Action} from '../common/Action';

import './CropMenu.css'

/*
first of all, fetch the original pick and display it
naaah, its gonna look weird, don't do that


wouldnt it be better for THIS component to handle the Overlay?
this way it could gracefully handle 

handlesend with axios
    if res not ok -> display custom message, redirect


*/



export default function PutAvatar( {onClose} ) {

    const fileInput = useRef(null);

    const [showCrop, setShowCrop] = useState(false);
    const [file, setFile] = useState(null);

    const setUploadAction = useRef(null);
    const setSendAction   = useRef(null);

    const getCropData  = useRef(null);

    const {subscribe, updateAvatar} = useUpdateAvatar();

    const unsubscribe = useRef(null);

    const onSend = useCallback( ()=>{
        setUploadAction.current('locked');
        setSendAction.current('waiting');
    }, []);
    const onRes = useCallback( ()=>{
        setUploadAction.current('finished');
        setSendAction.current('finished');
    }, []);
    const onErr = useCallback(()=>{
        setUploadAction.current('error');
        setSendAction.current('error', 'Something went wrong');
    }, []);

    

    // useEffect( ()=>{
    //     return () => {unsubscribe()};
    // }, [])

    useEffect(()=> {
        unsubscribe.current = subscribe( onSend, onRes, onErr );
        return () => {
            // setUploadAction.current = null;
            // setSendAction.current = null;

            // getCropData.current = null;

            unsubscribe.current()
        }
        // return () => {
        //     setUploadAction.current = null;
        //     setSendAction.current = null;
        //     setShowCrop.current = null;
        // }
    }, [])

    useEffect( ()=> {
        if( file ) setShowCrop( true );
    }, [file])


//= = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =

    const handleUpload = (e) => {

        setShowCrop(false);

        if( e.target.files && e.target.files[0] ){
            const _file = e.target.files[0];

            //aws parameterm, incorporate env
            if( _file.size / import.meta.env.VITE_FILE_LIMIT > 1 ){
                setUploadAction.current( 'alert', 'File too big, must be at most 1MB' );
                return;
            }

            //only lives here, hence cleaned on exiting scope
            const preview = document.createElement('img');

            preview.onload = (e) => {
                setFile( _file );
                setUploadAction.current('idle', '');
            }
            preview.onerror = (e) => {
                setFile(null);
                setUploadAction.current( 'alert', 'Something went wrong' );
                return;
            }

            preview.src = URL.createObjectURL( _file );
        }
    }

    const handleSend = () => {

        let data = getCropData.current();
        updateAvatar( data );
    }

    return (
        <Overlay>
            <div className='UpdateAvatar'>

                <div className='closerow'>
                    <span className='label'>
                        Close
                    </span>
                    <DeleteButton 
                        value='close'
                        onClick={onClose}/>
                </div>

                <input className='hidden'
                    type='file' 
                    accept="image/png, image/jpeg"

                    ref={fileInput}
                    onChange={ handleUpload }
                />
                <Action
                    value='upload_file'
                    name='Upload'
                    onClick={ () => fileInput.current.click() }
                    setRef={setUploadAction}
                    />

                { showCrop &&
                    <>
                        <div className='controls'>
                            <div className='control'>
                                <span className='icon material-icons'>pan_tool</span>
                                <span className='label'>Drag the box to move it</span>
                            </div>
                            <div className='control'>
                                <span className='icon material-icons'>mouse</span>
                                <span className='label'>Scroll to resize it</span>
                            </div>
                        </div>

                        <Crop
                            imgFile={file}
                            getResult={getCropData}
                        />
                        <Action
                            value='double_arrow'
                            name='Accept'
                            onClick={ handleSend }
                            setRef={setSendAction}
                            />
                    </>
                }
            </div>
        </Overlay>
    )
}