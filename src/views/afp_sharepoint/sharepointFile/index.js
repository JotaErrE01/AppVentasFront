import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'src/store';
import useAuth from 'src/contextapi/hooks/useAuth';
import { useSnackbar } from 'notistack';
import { getSharepointFile } from 'src/slices/sharepointFile';
import { Grid, CircularProgress } from '@material-ui/core';
import SharePointFileVisor from './SharePointFileVisor';
import { useParams } from 'react-router';

const SharePointFiles = ({ setEdit }) => {
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const params  = useParams();



    
    useEffect(() => {
        dispatch(getSharepointFile(enqueueSnackbar));
    }, [dispatch]);
   
    // DATA
    const _sharepointFile = useSelector(state => state.sharepointFile);

    const { sharepointFiles, loading, error } = _sharepointFile;

    
   const payload = sharepointFiles &&  sharepointFiles.find(item => item.id == params.id);

    

    if (error)  return <p>error</p>
    
    if (loading) return <Grid container xs={12} justify="center"><CircularProgress color="inherit" /> </Grid>
    
    if (sharepointFiles && sharepointFiles.length) {
        return (
            <SharePointFileVisor data={payload}/>
        )
    }
    return <></>



}

export default SharePointFiles;
