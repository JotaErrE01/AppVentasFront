import React from 'react';
import { makeStyles } from '@material-ui/core';
import { useSelector } from 'src/store';


const LoadSpinner = () => {
const load = useSelector(state => state.cliente.loadData)
    return (
        <div className="spinner" style={{display: load ? "block" : "none"}}  >
            <div className="bounce1"></div>
            <div className="bounce2"></div>
            <div className="bounce3"></div>
        </div>
    );
};

export default LoadSpinner;
