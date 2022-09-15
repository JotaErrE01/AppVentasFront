import React from 'react';
import styled from 'styled-components';
import LoginForm from './LoginForm';

const LoginLayout = ({ children, tipoFondo }) => {

    
	let img = 'kit_bienvenida_';

    if (tipoFondo == '000001') {
		img = img + 'flp.jpeg';
	} else {
		img = img + 'fcp.jpeg';
	}

    return (
        <Container>
            <FormSide>

                <Block>
                    <Logo src="/static/logos/genesis_vertical_blue.png"/>
                </Block>

                <Block>
                    {children}
                </Block>
                
          
            </FormSide>
            <ImagesSide>
                <Background src={'/static/mail/portadas/' + img}/>
            </ImagesSide>
        </Container>
    )
}

export default LoginLayout;

//MAIN CONTAINER
const Container = styled.div`
    background-color:#cacaca;
    height:100vh;
    width:100vw;
    display:flex;
    flex-direction:row;
    @media screen and (max-width:800px){
        flex-direction:column-reverse;
        align-items:center;
    }
`

// LADO A
const FormSide = styled.div`
    background:#ffffff;
    flex:4;

    @media screen and (max-width:800px){
        width:80vw;
        margin:-15em 0 3em 0;
        border-radius:9pt;
        z-index:1;
    }
    @media screen and (max-width:600px){
        width:100vw;
        margin:0;
        border-radius:0;
    }

`
const Logo = styled.img`
    height:9em;
    /* width:3em; */
`
const Block = styled.div`
    padding:2.1em 0 1.5em 0;
    display:flex;
    flex-direction:column;
    align-items:center;
    
    h1 {
        font-size:1.5em;
    }

    a {
        color:#cacaca;
        text-transform:uppercase;
        font-size:.69em;
        margin:.3em;
    }

`



// LADO B
const ImagesSide = styled.div`
    background:#232f3e;
    flex:6;
    overflow: hidden;

    @media screen and (max-width:800px){
        max-height:45vh;
    }
    @media screen and (max-width:600px){
        max-height:24vh;
    }
    display:flex;
    justify-content:center;

`;

const Background = styled.img`
    height:100vh;
    /* object-fit:cover; */
    @media screen and (max-width:800px){
        max-height:45vh;
    }
    @media screen and (max-width:600px){
        max-height:24vh;
        width:100%;
    }
`