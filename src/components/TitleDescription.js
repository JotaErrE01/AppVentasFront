import React from 'react'
import {Typography, makeStyles} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
   title:{
    color: theme.palette.text.primary,
   },
   description:{
    color: theme.palette.text.secondary,
    fontWeight:'400',
    fontSize:'1.2em'
   },
   view:{
       margin:'.9em 0'
   }
}));

const TitleDescription = ({title, description}) => {
    const classes = useStyles();

    return (
        <div className={classes.view}>

            
            <Typography hiddden={!title} variant="h2" component="h2" className={classes.title}>
                {title}
            </Typography>
            <Typography  hiddden={!description}  variant="h4" component="h4" className={classes.description}>
                {description}
            </Typography>
        </div>
    )
}

export default TitleDescription

