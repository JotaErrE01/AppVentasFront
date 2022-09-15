import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';

import { getSalaCore } from 'src/slices/coreSala';
import { useSnackbar } from 'notistack';
import { useDispatch, useSelector } from 'src/store';

import useAuth from 'src/contextapi/hooks/useAuth';
import JSONTree from 'react-json-tree';
import RoomsGateway from 'src/views/afp_core_salas/gateway/RoomsGateway';

const CoreSalasView = () => {

    const { user } = useAuth();


    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useDispatch();
    const { idSala } = useParams();

    useEffect(() => {
        dispatch(getSalaCore(idSala, enqueueSnackbar))
    }, [dispatch]);

    const _coreSala = useSelector(state => state.coreSala)
    const coreSala = (_coreSala && _coreSala.coreSala) ? _coreSala.coreSala : false;


    //


    const refScreenShare = useRef();



    const [streamLocal, setStreamLocal] = useState({
        nameUserJoin: user.usuario,
        name: user.name,
        view: false,
        viewVideo: true,
        refStream: useRef(null)
    });


    const [streamArr, setStreamArr] = useState([]);

    // const isHost = coreSala && coreSala.host && coreSala.host.id == user.id;
    
    const isHost = true;




    if (coreSala && coreSala.id) {
        const payload = coreSala;
        
    }


    return (

        coreSala && coreSala.id ?
            <RoomsGateway
                //::  PARTICIPANTS
                streamArr={streamArr}
                setStreamArr={setStreamArr}
                //:: LOCAL
                streamLocal={streamLocal}
                setStreamLocal={setStreamLocal}

                //:: SCREEN SHARE
                refScreenShare={refScreenShare}
                //:: SETTINGS
                roomName={parseInt(coreSala.description)}


                //:: DECORS 
       
                authUser ={user}
                roomDescripcion={coreSala.host.descripcion_localidad}
                isHost={isHost}
                userList={coreSala.users}
                coreSala={coreSala}
            />

            : <></>



    );














    return (
        <div>
        </div>
    )
}

export default CoreSalasView;
