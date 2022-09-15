import { Grid, IconButton, Box, makeStyles } from '@material-ui/core';
import zIndex from '@material-ui/core/styles/zIndex';
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'react-feather';
import JSONTree from 'react-json-tree';

import { Document, Page, pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const SharePointFileVisor = ({ data }) => {

    const file = data.share_point_file.blob_file;


    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);

    function onDocumentLoadSuccess({ numPages }) {

        setNumPages(numPages);
    }



    const classes = useStyles();

    return (


        <div className={classes.view}>


<Box className={classes.controls}>
                    <IconButton
                        disabled={pageNumber == 1}
                        color="primary"
                        aria-label="add to shopping cart"
                        className={classes.control}
                        onClick={() => setPageNumber(pageNumber - 1)}>
                        <ChevronLeft />
                    </IconButton>
                   
                    <h3 className={classes.numbers}>{pageNumber}/{numPages}</h3>

                    <IconButton
                        disabled={numPages - pageNumber == 0}
                        color="primary"

                        aria-label="add to shopping cart"
                        className={classes.control}
                        onClick={() => setPageNumber(pageNumber + 1)}>
                        <ChevronRight />
                    </IconButton>

                </Box>

            <Document
                file={file}
                onLoadSuccess={onDocumentLoadSuccess}
                className="pdfFull">

               
                <Page pageNumber={pageNumber} />



            </Document>


        </div>

    )
}

export default SharePointFileVisor


const useStyles = makeStyles((theme) => ({
    view: {
        display: 'flex',
        flexDirection: 'column',
        overflow: 'none'
    },

    numbers: {
        margin: 'auto'
    },

    controlsContainer: {
      
    },
    controls: {
        top:'20em',
        width: '100%',
        display: 'flex',

    },
    control: {
        margin: '.3em'
    }
}));