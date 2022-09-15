import React, { useState } from 'react'
import { palette } from 'src/theme';
import styled from 'styled-components';

const CardButtonList = ({ children, translate, setTranslate }) => {

    const [bottom, setBottom] = useState(0);

    const handleSmall = () => {
        if (translate === 0) {
            setTranslate(81)
        } else {
            setTranslate(0)
        }
    }

    return (
        <Menu translate={translate} bottom={bottom}>
            {children}
        </Menu>

    )
}

export default CardButtonList


const Menu = styled.div`
    position: absolute; 


    bottom:${props => props.bottom && props.bottom};
    border-radius: 12pt  12pt 0 0;
    will-change: transform;

    transition: .3s ease;
    transform: translateY(${props => props.translate && props.translate + '%'});

    background-color:${props => props.translate ? 'none' : palette.primary.contrastText};



    width:100%;
    overflow-x:hidden;
    padding:0;

    padding-bottom:5.4em;
    z-index:4;
  
`

