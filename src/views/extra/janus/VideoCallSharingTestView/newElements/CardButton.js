import { ButtonBase } from '@material-ui/core';
import React from 'react';
import { palette } from 'src/theme';
import styled from 'styled-components';

const CardButton = ({ children, art, onClick, disabled , icon}) => {
    return (
        <View>
            <ButtonBase onClick={onClick} disabled={disabled}
                style={{
                    justifyContent: 'flex-start', 
                    width: '100%',
                    border: '1px solid #efefef', 
                    borderRadius: '1.2em',
                    
                }}
            >
                <CardView>
                    {
                       <CardImage src={art} alt="fireSpot" />
                    }
                    <p align="left"> {children} </p>
                </CardView>
            </ButtonBase>
        </View>
    )
}

export default CardButton;


const View = styled.div`
    margin:.9em;
    border-radius:1.2em;
    background-color: ${palette.primary.contrastText}
`;

const CardView = styled.div`

    border-radius:.9em;
    display:flex;
    p{
        font-family: Helvetica, sans-serif;
        margin:.9em;
        left: 0;
        font-size: 1.5em;
    }
`;

const CardImage = styled.img`
    height:12vh;
    width:12vh;
    object-fit:cover;
    border-radius:1.2em 0 0 1.2em;

`