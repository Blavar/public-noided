import {useRef, useState, useEffect, createElement} from 'react';

import './Crop.css'


// Image cropper
// given an image, one can move and resize a highlighted box
// to choose which part of the image will serve as a new avatar

export default function Crop({imgFile, getResult}){

    const width  = useRef(0);
    const height = useRef(0);

    const minSize = 100;
    const deltaSize = 10;

    const maxSize = useRef(0);

    const boxX    = useRef(0);
    const boxY    = useRef(0);
    const boxSize = useRef( minSize );

    const [renderX, setRenderX] = useState(0);
    const [renderY, setRenderY] = useState(0);
    const [renderSize, setRenderSize] = useState(minSize);

    const img    = useRef(null)
    const crop   = useRef(null);
    const shade  = useRef(null);

    const setSize = ( canvas ) => {

        canvas.current.width  = width.current;
        canvas.current.height = height.current;
    }

    // useEffect( ()=>{

    //     return ()=> {
    //         return () => {
    //             setUploadAction.current = null;
    //             setSendAction.current = null;
    
    //             getCropData.current = null;
    //             cropData.current = null;
    //         }
    //     }
    // }, [])

    //init
    useEffect( () => {

        let inputImg = document.createElement('img');

        inputImg.onload = () => {
            height.current = window.innerHeight / 2;
            width.current = height.current/inputImg.height * inputImg.width;

            maxSize.current = Math.min( width.current, height.current );

            setSize( img,   width.current, height.current );
            setSize( shade, width.current, height.current );
            setSize( crop,  width.current, height.current );

            let imgContext = img.current.getContext('2d');        
            imgContext.drawImage( inputImg, 0, 0, inputImg.width, inputImg.height, 0, 0, width.current, height.current );

            let shadeContext = shade.current.getContext('2d');
            shadeContext.fillStyle = 'rgb( 0, 0, 0, 0.8 )';

            boxX.current = 0;
            boxY.current = 0;
            boxSize.current = minSize;

            adjustBox();
            drawBox();
        }

        inputImg.src = URL.createObjectURL( imgFile );

        return () => {
            boxX.current    = null;
            boxY.current    = null;
            boxSize.current = null;

            img.current     = null;
            crop.current    = null;
            shade.current   = null;
        }
    
    }, []);

    //refresh
    useEffect( () => {
        drawBox();
    }, [renderX, renderY, renderSize]);
    

    const adjustBox = () => {

        if( boxSize.current < minSize ) boxSize.current = minSize;
        else if( boxSize.current > maxSize.current ) boxSize.current = maxSize.current;

        if( boxX.current < 0 ) boxX.current =( 0 );
        else if( boxX.current + boxSize.current > width.current ) boxX.current = width.current - boxSize.current;

        if( boxY.current < 0 ) boxY.current = 0;
        else if( boxY.current + boxSize.current > height.current ) boxY.current = height.current - boxSize.current;
    
        setRenderX( boxX.current );
        setRenderY( boxY.current );
        setRenderSize( boxSize.current );
    }

    const drawBox = () => {

        let shadeContext = shade.current.getContext('2d');        

        shadeContext.drawImage( img.current, 0, 0, width.current, height.current )
        shadeContext.fillRect( 0, 0, width.current, height.current );
        shadeContext.clearRect( renderX, renderY, renderSize, renderSize );

        let cropContext = crop.current.getContext('2d');
        cropContext.drawImage( img.current, 0, 0, width.current, height.current )
        cropContext.drawImage( shade.current, 0, 0, width.current, height.current )
    }

    getResult.current = () => {

        let result = document.createElement('canvas');
        result.width  = renderSize;
        result.height = renderSize;

        let resultContext = result.getContext('2d');
        resultContext.drawImage( img.current, renderX, renderY, renderSize, renderSize, 0, 0, renderSize, renderSize );

        return result.toDataURL('image/jpg');
    }

// = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = 

    //on the verge of requiring a state pattern
    const [mouseInside, setMouseInside] = useState( false );
    const [mouseInsideBox, setMouseInsideBox] = useState( false );
    const [mouseDragging, setMouseDragging] = useState( false );


    const isMouseInsideBox = (x, y) => {

        const rect = crop.current.getBoundingClientRect();
        const cropX = rect.x;
        const cropY = rect.y;

        let res = (x > boxX.current + cropX && x < boxX.current + boxSize.current + cropX && 
                   y > boxY.current + cropY && y < boxY.current + boxSize.current + cropY);
        return res;

    }

    const handleWheel = (e) => {
        if ( mouseInside ) boxSize.current = boxSize.current + ( e.deltaY > 0 ? -deltaSize : deltaSize );
        adjustBox();
    }

    const handleMouseDown = (e) => {
        if( mouseInsideBox ) setMouseDragging( true );
    }

    const handleMouseMove = (e) => {

        setMouseInsideBox( isMouseInsideBox(e.clientX, e.clientY) )

        if( mouseDragging ){
            boxX.current = boxX.current + e.movementX;
            boxY.current = boxY.current + e.movementY;
        }
        adjustBox();
    } 



// = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = 

    return(
        <div className='Crop'>

            <canvas
                className={ (mouseInside ? 'mouse-inside ' : '') +
                            (mouseInsideBox ? 'mouse-inside-box ' : '') + 
                            (mouseDragging ? 'mouse-grabbing ' : '')}
                width={0}
                height={0}
                ref={crop}

                onMouseMove={ handleMouseMove }
                onMouseDown={ handleMouseDown }
                onMouseUp={ () => setMouseDragging(false) }
                onMouseEnter={ () => setMouseInside( true ) }
                onMouseLeave={ () => setMouseInside( false ) }
                onWheel={ handleWheel }
            />

            <canvas
                className='hidden'
                ref={shade}
            />
            <canvas
                className='hidden'
                ref={img}
            />
        </div>
    )
}