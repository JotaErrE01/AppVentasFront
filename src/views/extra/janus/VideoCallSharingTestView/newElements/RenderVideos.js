import Draggable from 'react-draggable';
import React, { useState } from 'react'
import styled from 'styled-components'
import { palette } from 'src/theme';
import { isMobile, isEdgeChromium } from "react-device-detect";
import JSONTree from 'react-json-tree';



const RenderDragable = ({ children }) => {

    return !isMobile ?

        <Draggable onStop={() => { }} >
            {children}
        </Draggable>

        :
        <>

            {children}

        </>

}



export const RenderVideo = ({ muted, stream, hasLogo, hidden }) => {
    const tallDef = 100;
    const [tall, setTall] = useState(tallDef);
    const onClickHandler = event => {
        if (tallDef == tall) {
            setTall(tallDef / 4.5);
            return;
        }
        setTall(tallDef);

    }

    return (

        <>


        <RenderDragable>


            <VideoContainer height={`${tall}%`} onDoubleClick={onClickHandler} 

            
            >
                <video
                    ref={stream}
                    style={{ height: '100%',maxWidth: '100%', borderRadius: '12pt',}}
                    muted={muted && "muted"}
                    autoPlay  
                    playsInline
                    loop
                >
                    
             
                </video>
                {
                    hasLogo && <GenesisImage src="/images/logo.svg" draggable="true" />
                }

            </VideoContainer>


        </RenderDragable>

        </>
    )
}

export const RenderShare = ({ muted, stream, hasLogo, hidden, onClose,  }) => {
    const tallDef = 100;
    const [tall, setTall] = useState(tallDef);
    const onClickHandler = event => {
        if (tallDef == tall) {
            setTall(tallDef / 2.1);
            return;
        };
        setTall(tallDef);
    }


      
                return (


                    <RenderDragable>
                        <Sharecontainer width={`${tall}`} onDoubleClick={onClickHandler} style={{ visibility: hidden && 'hidden' }} >
                            <video
                                ref={stream}
                                style={{
                                    height: '100%',
                                    width: '100%',
                                    borderRadius: '12pt',
                                    // position:'fixed',
                                    // top:0

                                }}
                                muted={muted && "muted"}
                                autoPlay 
                                loop 
                                playsInline
                            >
                                

                            </video>
                            {
                                hasLogo && <GenesisImage src="/images/logo.svg" draggable="true" />
                            }

                        </Sharecontainer>


                    </RenderDragable>
                )
            
    }

   





export const GenesisImage = styled.img`
    position:absolute;
    z-index:3;
    height:2.1em;
    margin:1.2em;
`




export const View = styled.div`
    height:100vh;
    overflow-x:hidden;
    display:flex;
    flex-direction:column;
   align-items:center;
`;


export const MainSide = styled.div`
    height:48vh;
    background-color:#ffffff;

    display:flex;
    justify-content:center;
    width:100vw;
`;

export const SecondarySide = styled.div`
    height:48vh;
    background-color:#1a1b24;

    display:flex;
    justify-content:center;
    width:100vw;

`;

export const VideoContainer = styled.div`
    height: ${props => props.height ? props.height : '100%'};
    /* width:100%; */
    display:flex;
    border-radius: 19pt;
    cursor: grab;
    will-change: transform;
    transition: .06s ease-in;  
    padding:.9em;

`


export const Sharecontainer = styled.div`
    width: ${props => props.width ? (props.width * .8)+'%' : '80%'};
    display:flex;
    border-radius: 19pt;
    cursor: grab;
    will-change: transform;
    transition: .06s ease-in;  
    position:fixed;
    /* background-color:red; */
    z-index:4;
    width:100%;
    height:100%;
    

`

export const SharePdf = styled.div`
    display:flex;
    border-radius: 19pt;
    cursor: grab;
    will-change: transform;
    transition: .06s ease-in;  
    position:fixed;
    background-color:#000000;
    z-index:4;
    
    width:80vw;
    height:80vh;

`



export const Display = styled.div`
   height:30vh;
   background-color:blue;
   position:absolute;
   top:0
`




