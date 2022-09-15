import { Button, Dialog, List, ListItem, ListItemText, Typography } from '@material-ui/core';
import React , {useState} from 'react'

const Feedback = ({ feedback, setFeedback }) => {
    const { title } = feedback || ".";
    const { body } = feedback || ".";
    const { action } = feedback || '';
    const { trigger } = feedback || false;


    
    

    return (
        <Dialog open={feedback ? true : false} onClose={()=>{setFeedback(null)}}>

            <List>
            <ListItem>
                <Typography  variant="h3" style={{display:'flex', justifyContent:'center', width:'100%'}}>
                 {title}
                </Typography>
            </ListItem>
            <ListItem>
                <ListItemText>
                {body}
                </ListItemText>
            </ListItem>
            <ListItem>
            <ListItemText  style={{display:'flex', justifyContent:'center', width:'100%'}}>
                {
                        action &&  trigger&&   
                        <Button size="large" color='primary' variant="outlined" onClick={()=>trigger()}>{action}</Button>

                }
                </ListItemText>
            </ListItem>
            </List>
           
   

        </Dialog>
      
    )
}

export default Feedback
