import React, { useState } from 'react'
import useAuth from 'src/contextapi/hooks/useAuth';
import styled from 'styled-components';
import useIsMountedRef from 'src/contextapi/hooks/useIsMountedRef';
import LoginForm from './LoginForm';
import PasswordForm from './PassWordForm';
import { Button } from '@material-ui/core';
import { CSS_HELPERS, THEME_COLORS } from 'src/theme/customBreakpoints';

const Login = ({ children }) => {



    const [resetForm, setResetForm] = useState(false)


    const auth = useAuth();
    const { login, errors, forgotPassword, password_reset_error, password_reset_success } = useAuth();


    const isMountedRef = useIsMountedRef();

    const onLogin = async (values, {
        setErrors,
        setStatus,
        setSubmitting
    }) => {
        try {
            await login(values.usuario, values.password);
            if (isMountedRef.current) {
                setStatus({ success: true });
                setSubmitting(false);
            }
        } catch (err) {
            console.error(err);
            if (isMountedRef.current) {
                setStatus({ success: false });
                setErrors({ submit: true });
                setSubmitting(false);
            }
        }
    }

    const onChangePassWord = async (values, {
        setErrors,
        setStatus,
        setSubmitting
    }) => {

        console.log(values)

        try {
            await forgotPassword(values.usuario, values.password, values.nuevoPassword);
            if (isMountedRef.current) {
                setStatus({ success: true });
                setSubmitting(false);
            }
        } catch (err) {
            console.error(err);
            if (isMountedRef.current) {
                setStatus({ success: false });
                setErrors({ submit: true });
                setSubmitting(false);
            }
        }
    }



    return (
        <Container>
            <FormSide>

                <Block>
                    <Logo src="/static/logos/genesis_logo_blue_full.svg" />
                </Block>

                {
                    !resetForm ?
                        <Block>
                            <LoginForm
                                onSubmit={onLogin}
                                errorList={errors}
                                onChangeForm={()=>setResetForm(!resetForm)}
                            />
                        </Block> :
                        <Block>
                            <PasswordForm
                                onSubmit={onChangePassWord}
                                password_reset_error={password_reset_error}
                                password_reset_succes={password_reset_success}
                                onChangeForm={()=>setResetForm(!resetForm)}

                            />
                        </Block>



                }











            </FormSide>
            <ImagesSide>
                <Figure src={'/static/images/placeholder/login.jpg'} />
            </ImagesSide>
        </Container>
    )
}

export default Login



//MAIN CONTAINER
const Container = styled.div`
    background-color:${THEME_COLORS.light.primary.contrastText};
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
    background:${THEME_COLORS.light.bg.main};
    ${CSS_HELPERS.BOX_SHADOW};

    flex:4.5;
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
    margin:.9em;
    height:3.6em;
    object-fit: cover;
`
const Block = styled.div`
    padding:.9em;
    margin:.9em;
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
    
`;




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

const Figure = styled.img`
    height:100vh;
    width:100%;

    object-fit:cover;

    @media screen and (max-width:800px){
        width:100%;

    }
    @media screen and (max-width:600px){
        max-height:24vh;
        width:100%;
    }
`