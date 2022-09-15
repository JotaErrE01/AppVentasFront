import React, { useState, useEffect } from 'react'
import { Button, CardActions, TextField, Grid, Box } from '@material-ui/core';
import { useSnackbar } from 'notistack';
import { useRef } from 'react'
import JSONTree from 'react-json-tree';
import LabelHex from 'src/components/LabelHex';
import TitleDescription from 'src/components/TitleDescription';
import useAuth from 'src/contextapi/hooks/useAuth';
import { postSharepointFile } from 'src/slices/sharepointFile';
import { useDispatch } from 'src/store';
import { base64toType, readURL, typeToColor } from 'src/utils/filehelpers'
import ComboBox from '../ComboBox';
import ComboCatDistribucion from '../ComboCatDistribucion';

const SharepointEditForm = ({
    tipoFondo, setTipoFondo, tipoFondos,
    catDistribucion_id, set_catDistribucion_id, catDistribucion,
}) => {
    

    

    const [body, setBody] = useState(false);

    const [file, setFile] = useState({});
    const [description, setDescription] = useState(false);

    const { user } = useAuth();
    const fileRef = useRef();
    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useDispatch();

    useEffect(() => {
        const payload = file;

        const foreigns = {
            codigo_tipo_fondo: tipoFondo,
            catDistribucion_id
        }

        setFile({ ...file, ...foreigns })
    }, [tipoFondo, catDistribucion_id])

    //:: 1 ::
    const onFileRefChange = async e => {
        const file = e.target.files[0];
        e.target.value = null;
        const type = readURL(file);
        const reader = new FileReader();
        if (file) reader.readAsDataURL(file);
        reader.onload = (read) => {
            const { result } = reader;
            const roleHasSharepointFile = {
                codigo_tipo_fondo: tipoFondo,
                created_by: user.id,
                updated_by: user.id,
            }
            const sharepointFile = {
                type: type,
                blob_file: result,
            }
            const payload = {
                ...roleHasSharepointFile, ...sharepointFile
            }
            
            setFile(payload);
        };
    };

    const handleUpload = () => {
        const body = { description, ...file }
        dispatch(postSharepointFile(body, enqueueSnackbar, () => { setFile(false); setDescription(false); }));
    };



    return (
        <Box>
            <input ref={fileRef} type="file" hidden onChange={onFileRefChange} />
            {
                file.blob_file && (

                    <Grid container spacing={2} >

                        <Grid item xs={12}>
                            {file.type &&
                                <LabelHex color={typeToColor(file.type)}>
                                    {file.type}
                                </LabelHex>
                            }
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                id="filled-multiline-static" label="Breve descripcion"
                                onChange={e => setDescription(e.target.value)}
                                multiline rows={4} variant="filled"
                                style={{ width: '100%' }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <ComboBox id={tipoFondo} setId={setTipoFondo} data={tipoFondos} title="Línea de negocio" />
                        </Grid>

                        <Grid item xs={12}>
                            <ComboCatDistribucion id={catDistribucion_id} setId={set_catDistribucion_id} data={catDistribucion} title="Línea de negocio" />
                        </Grid>

                    </Grid>

                )

            }


            <CardActions style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>

                {
                    !file.blob_file &&
                    <Button onClick={() => { fileRef.current.click(); }}>
                        Nuevo
                    </Button>
                }

                <Button disabled={!file || !description} onClick={handleUpload}>
                    Guardar
                </Button>

            </CardActions>


        </Box>
    )
}

export default SharepointEditForm
