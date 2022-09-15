import React, { useRef, useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import _ from 'lodash'

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Cropper } from 'react-cropper';
import imageCompression from 'browser-image-compression';

import {
    CardActions, CardHeader, CardContent, CardMedia, Card,

    Box, ButtonBase, Container, Dialog, IconButton
} from '@material-ui/core';
import styled from 'styled-components'



import { getObtenerDocumentosOportunidad, postEnviarDocumentos2 } from 'src/slices/clientes';
import { useDispatch } from 'src/store';
import { useSnackbar } from 'notistack';
import { Alert } from '@material-ui/lab';

import JSONTree from 'react-json-tree';
import { debug } from 'request';
import { DobleCaraCanvas } from 'src/components/common/DobleCaraCanvas';
import { Document } from 'react-pdf';

import { UploadCloud as UploadIcon } from 'react-feather'
import CustomDialog from 'src/components/common/CustomDialog';
import { Close, CloudUploadOutlined, AddAPhoto } from '@material-ui/icons';
import { blobToUrl } from 'src/utils/filehelpers';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        border: 0
    },

    media: {
        height: 140,
    },
    pdfWrap: {
        position: 'relative',
        paddingBottom: ' 56.25%',
        paddingTop: '25px',
        height: 0
    },

    pdfFrame: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
    },



}));



// _HELPER FNS

const getFileType = (payload) => {
    if (payload) {
        const ext = payload.archivo.archivo.split(';');
        switch (ext[0]) {
            case "data:image/png": return 'imagen';
            case "data:application/pdf": return 'pdf';
            default: return 'nofile'
        }
    }
    return 'nofile'
};

const encodeBase64 = file => {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file)
        fileReader.onload = () => {
            resolve(fileReader.result)
        };
        fileReader.onerror = error => {
            reject(error)
        };
    });
};



async function handleCompress(file) {

    const imageFile = file;
    console.log('originalFile instanceof Blob', imageFile instanceof Blob); // true
    console.log(`originalFile size ${imageFile.size / 1024 / 1024} MB`);

    const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true
    }
    try {
        const compressedFile = await imageCompression(imageFile, options);
        console.log('compressedFile instanceof Blob', compressedFile instanceof Blob); // true
        console.log(`compressedFile size ${compressedFile.size / 1024 / 1024} MB`); // smaller than maxSizeMB

        return compressedFile;
    } catch (error) {
        console.log(error);
    }

}


export default function FilesUploadView({
    oportunidadId,
    adjuntosCheckList,
    archivosAdjuntos,
    adjuntosError

}) {

    const dispatch = useDispatch();
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();

    //UPLOAD
    const fileRef = useRef(null);


    const [fileToSend, setFileToSend] = useState(false);
    const [cropper, setCropper] = useState(false);
    const [payloadIds, setPayloadIds] = useState({})

    const [openModalUploadImage, setOpenModalUploadImage] = useState(false);
    const [subir, setSubir] = useState(false);

    const [debugError, setDebugError] = useState(false);








    //REMOVES CONTRATO
    const _adjuntosCheckList = adjuntosCheckList.filter(e => e.es_autogenerado !== 1);

    //MAP CHECKLIST INTO ARCHCHIVOS
    const mapchecklist = _adjuntosCheckList.map(tipoDocumento => {
        const adjunto = _.find(
            archivosAdjuntos,
            { tipo_documento_id: tipoDocumento.tipo_documento_id }
        );
        const payload = {
            ...tipoDocumento,
            adjunto,
            extension: getFileType(adjunto),
        };
        return payload;
    });




    // :: 1 :: ESTABLECE DATOS DE IMAGEN SELECCIONADA Y DISPARA EL INPUT
    const handleSetPayload = (data, isDobleCara) => {

        if (!isDobleCara) {
            fileRef.current.click();
        } else {
            _fileRef.current.click();
        }
        const { cod_adjunto_catalogo, tipo, tipo_documento_id, id_beneficiario } = data;
        setPayloadIds({
            tipo: tipo ? tipo : 3,
            cod_adjunto_catalogo,
            tipo_documento_id,
            id_beneficiario
        });
    };


    //:: 2  :: CUANDO CAMBIA inputRef
    const onChange = async event => {
        const file = event.target.files[0];
        let base64;;
        if (file.type != 'application/pdf') {
            const resized = await handleCompress(file);
            base64 = await encodeBase64(resized);
            setOpenModalUploadImage(true);
        } else {
            //TODO: WATCH WHAT HAPPENS ON IMAGE
            base64 = await encodeBase64(file);
            setSubir(true);
        };
        setFileToSend({ tipo: file.type, nombre: file.name, base64 });
    };



    const envioArchivos = () => {
        let _fileToSend = fileToSend;
        if (_fileToSend.tipo != 'application/pdf') {
            _fileToSend = {
                ...fileToSend,
                base64: cropper.getCroppedCanvas().toDataURL(_fileToSend.tipo)
            };
        }
        const body = {
            oportunidad_id: oportunidadId,
            archivo: _fileToSend.base64,
            nombre_archivo: _fileToSend.nombre,
            ...payloadIds
        };
        dispatch(postEnviarDocumentos2(body, enqueueSnackbar));
        setOpenModalUploadImage(false);
    };


    // :: REFERENCIAS DE DOBLE CARA




    const _fileRef = useRef(null);
    const ctxRef = useRef();
    const [imageParts, setImageParts] = useState([]);
    const [merged, setMerged] = useState();



    useEffect(() => {
        if (imageParts.length >= 1) {
            const ctx = new DobleCaraCanvas(ctxRef.current);
            ctx.join(imageParts);
            const _save = ctx.save();


            setFileToSend(_save)
        }
    }, [imageParts]);




    //:: 1 ::
    const _onChange = async e => {

        const file = e.target.files[0];

		const mbSize = file.size / 1024 / 1024;

		if(mbSize > 5) {			
			enqueueSnackbar('Solo se permiten archivos de máximo 5MB', {
				variant: 'warning'
			});

			return;
		}
        
        const reader = new FileReader();
        if (file) reader.readAsDataURL(file);
        reader.onload = (read) => {
            const image = new Image();
            image.src = read.target.result;
            setImageParts([...imageParts, image]);
        };
    };

    //:: 2 ::

    const _clean = () => {
        setImageParts([0]);
    };

    //:: 3 ::

    const _envioArchivos = () => {
        let _fileToSend = fileToSend;

        const body = {
            oportunidad_id: oportunidadId,
            archivo: _fileToSend,
            nombre_archivo: 'documento.jpeg',
            ...payloadIds
        };


        dispatch(postEnviarDocumentos2(body, enqueueSnackbar));
        _clean();
    };





    return (
        <>

            <CustomDialog
                title="Sube tus Documentos"
                open={imageParts.length}
                onClose={_clean}
            >

                <canvas ref={ctxRef} />




                <ButtonsView>

                    <Button
                    onClick={_clean}
                    variant="contained"
                    color="secondary"
                    startIcon={<Close />}
                    >
                    Cancelar
                    </Button>
                  
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddAPhoto />}
                        onClick={() => handleSetPayload(payloadIds, 1)}
                    >
                    Agregar
                    </Button>


                    <Button
                    variant="contained"
                    color="default"
                    startIcon={<CloudUploadOutlined />}
                    onClick={_envioArchivos}
                    >
                    Subir
                    </Button>


                    </ButtonsView>

            
            </CustomDialog>

            <input
                ref={fileRef}
                type="file" style={{ display: "none" }}
                onChange={(e) => onChange(e)}
                accept="image/png, image/jpeg, .pdf"
            />
            <input
                ref={_fileRef}
                type="file" style={{ display: "none" }}
                onChange={_onChange}
                accept="image/png, image/jpeg, .pdf"
            />


      

            {/*::: LIST :::*/}

            <Container maxWidth="md">



                <Grid container spacing={3} >
                    {
                        mapchecklist.map(item => {

                            return (
                                <>
                                    <Grid item xs={12} sm={12} md={6}>

                                        <Card className={classes.root}>


                                            {
                                                item.extension == 'imagen' &&
                                                <CardMedia
                                                    className={classes.media}
                                                    image={item.adjunto.archivo.archivo}
                                                    title="adjunto"
                                                />
                                            }
                                            {
                                                item.extension == 'pdf' &&
                                        
                                                <iframe 
                                                src={item.adjunto.archivo.archivo}
                                                frameborder="0" 
                                                height="100%" 
                                                width="100%"/>

                                            }{
                                                item.extension == 'nofile' &&
                                                <CardMedia
                                                    className={classes.media}
                                                    image={'/static/images/placeholder/placeholder.png'}
                                                    title="No hay adjunto"
                                                />
                                            }


                                            <CardHeader
                                                action={
                                                    <IconButton
                                                        onClick={() => handleSetPayload(item, 1)}
                                                        aria-label="settings">
                                                        <UploadIcon />
                                                    </IconButton>
                                                }
                                                title={item.nombre}
                                                subheader=""
                                            />
                                        </Card>

                                        {/* </PopOver> */}
                                    </Grid>


                                </>


                            )
                        }
                        )
                    }
                </Grid>
            </Container>


            {/*::: DOBLE CARA DIALOG  :::*/}





            {/*::: IMAGES DIALOG :::*/}
            <Dialog
                onClose={() => setOpenModalUploadImage(false)}
                open={openModalUploadImage}
                style={{ display: 'flex', flexDirection: 'column' }}
            >
                {
                    <Cropper
                        style={{ overflowX: 'hidden' }}
                        initialAspectRatio={16 / 9}
                        minCropBoxWidth={59}
                        minCropBoxHeight={50}
                        responsive={true}
                        modal={1}
                        zoomable={false}


                        src={fileToSend.base64}
                        viewMode={2}



                        background={false}
                        autoCropArea={1}
                        onInitialized={(instance) => { setCropper(instance); }}
                    />
                }

                <Box style={{ display: 'flex', flexDirection: 'column', marginTop: '.6em' }}>
                    <Button onClick={() => setOpenModalUploadImage(false)} style={{ marginBottom: '.6em' }}>
                        Cancelar
                    </Button>
                    <Button onClick={envioArchivos} style={{ marginBottom: '.6em' }} color="primary" o>
                        Subir
                    </Button>
                </Box>

            </Dialog>


            {/*:: PDF DIALOG ::*/}

            <Dialog
                onClose={() => setSubir(false)}
                open={subir}
                style={{ display: 'flex', flexDirection: 'column' }}
            >


                <Box style={{ display: 'flex', flexDirection: 'column', marginTop: '.6em' }}>
                    <Button onClick={() => setSubir(false)} style={{ marginBottom: '.6em' }}>
                        Cancelar
                        </Button>
                    <Button onClick={envioArchivos} style={{ marginBottom: '.6em' }} color="primary" o>
                        Subir
                        </Button>
                </Box>


            </Dialog>



        </>
    );
}



const ButtonsView = styled.div`
display:flex;
flex-direction:column;
width:100%;
align-items: center;
margin-top:.9em;
button {
    margin:.6em;
    width:30em;
    height:3.3em;
    border-radius:3em;
}
`