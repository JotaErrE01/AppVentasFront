import React, { useState, useEffect } from 'react';
import baseurl from 'src/config/baseurl';
import LoginLayout from './view/LoginLayout'
import axs from 'src/utils/axs'
import JSONTree from 'react-json-tree';
import { Box, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, Typography } from '@material-ui/core';
import { Paperclip } from 'react-feather';
import { BluetoothDisabledOutlined } from '@material-ui/icons';
import { blobToUrl, urlDownload } from 'src/utils/filehelpers';
import LoadSpinner from 'src/components/LoadSpinner';
import LoadBounce from 'src/components/common/LoadBounce';

const SharepointPublic = () => {

    const [files, setFiles] = useState([])


    useEffect(() => {
        async function fetchMyAPI() {
        
            const query = "/afp/crm/rol_has_sharepoint_file/categoria/2/1"
            let response = await axs(`${baseurl}${query}`);
                response = response &&  response.data;
            

            if(response && response.data && response.data.sharepointFiles){
                
                const payload = response.data.sharepointFiles.map(item=> ({
                    description: item.description,
                    blob_file: item.share_point_file.blob_file
                }));
                setFiles(payload)

            }
        }
    
        fetchMyAPI()
      }, [])


   
      const handleShare = async (file, description) => {
        const name = description;
        const fileURL = blobToUrl(file);
        urlDownload(fileURL, name);
    }
    
       

    return (
        <LoginLayout>

            <Typography variant='h1'>Hola, gracias por ser parte de nosotros</Typography>
           <Box m={3}>
                <Typography variant='h5'> Adjuntamos las guías de tu fondo. </Typography>
           </Box>

           <LoadBounce load={files.length==0}/>

         
            <List style={{width:'80%'}}>
                {
                    files.map(item => (
                        <ListItem  style={{marginBottom:'.9em'}}>
                            <ListItemText
                                primary={item.description}
                            />
                            <ListItemSecondaryAction>
                                <IconButton onClick={()=>handleShare(item.blob_file,item.description)}>
                                    <Paperclip/>
                                </IconButton>
                            </ListItemSecondaryAction>

                        </ListItem>))
                }
            </List>
        </LoginLayout>
    )
}


export default SharepointPublic