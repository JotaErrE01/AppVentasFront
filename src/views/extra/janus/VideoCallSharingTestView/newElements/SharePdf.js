import { IconButton } from '@material-ui/core';
import React from 'react';
import { ChevronLeft, ChevronRight } from 'react-feather';
import { palette } from 'src/theme';
import styled from 'styled-components';
import { Document, Page } from 'react-pdf';

const SharePdf = ({file,

    pageNumber,
    goToPrevPage,
    goToNextPage,
}
    
    
  
    ) => {
    return (
        <View>

            <ControlsView>
                <IconButton onClick={goToPrevPage}>
                    <ChevronLeft />
                </IconButton>


                <IconButton>
                    <ChevronRight onClick={goToNextPage}/>
                </IconButton>

            </ControlsView>

            <Document file={file}>
                <Page pageNumber={pageNumber} />
            </Document>


        </View >
    )
}

export default SharePdf;


const View = styled.div`
    height:100vh;
    background-color:${palette.bgs.azn_dark};
    display:flex;
    justify-content:center;
`


const ControlsView = styled.div`
    /* height:100vh; */
    background-color:${palette.bgs.azn_dark};
    display:flex;
    justify-content: space-between;
    width:100%;
    position:absolute;
    top:45vh;
 
`
