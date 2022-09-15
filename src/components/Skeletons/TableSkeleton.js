import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Skeleton from '@material-ui/lab/Skeleton';


function Media(props) {
    const { loading = false } = props;

    return (
        <Grid container wrap="nowrap">
            {
                (loading ? Array.from(new Array(9)) : [])
                    .map((item, index) => (
                        <Box key={index} style={{ display: 'flex' }} marginRight={0.5} my={.5}>
                            <Skeleton variant="rect" width={210} height={45} style={{borderRadius:'1.2pt'}}/>
                        </Box>
                    ))}
        </Grid>
    );
}

Media.propTypes = {
    loading: PropTypes.bool,
};

export default function TableSkeleton() {
    const rows = [1,2,3,4,5,6]
    return (
        <Box overflow="hidden">

            {
                rows.map((item,index)=>
                    <Media loading key={index} />
                    
                )
            }
           

        </Box>
    );
}
