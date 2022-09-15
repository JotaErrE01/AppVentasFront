import { createStyles, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => createStyles({
  '@global': {
    '*': {
      boxSizing: 'border-box',
      margin: 0,
      padding: 0,
    },
    html: {
      '-webkit-font-smoothing': 'antialiased',
      '-moz-osx-font-smoothing': 'grayscale',
      height: '100%',
      width: '100%'
    },
    body: {
      width: "100%",
      height:" 100%",
      overflow: "hidden"
    },
    '#root': {
      height: '100%',
      width: '100%'
    }
  },



  "@media print": {
    ".noPrint" : {
      display:'none'
    },
    ".mustPrint" : {
      display:'absolute'
    }
  }


  
}));

const GlobalStyles = () => {
  useStyles();

  return null;
};

export default GlobalStyles;
