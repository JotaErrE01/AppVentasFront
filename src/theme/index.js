import _ from 'lodash';
import {
  colors,
  createMuiTheme,
  responsiveFontSizes
} from '@material-ui/core';
import { THEMES } from 'src/constants';
import { softShadows, strongShadows } from './shadows';
import typography from './typography';
import { esES } from '@material-ui/core/locale';

const baseOptions = {
  direction: 'ltr',
  typography,
  overrides: {
    MuiLinearProgress: {
      root: {
        borderRadius: 3,
        overflow: 'hidden'
      }
    },
    MuiListItemIcon: {
      root: {
        minWidth: 32
      }
    },
    MuiChip: {
      root: {
        backgroundColor: 'rgba(0,0,0,0.075)'
      }
    }
  }
};

const themesOptions = [
  {
    name: THEMES.LIGHT,
    overrides: {
      MuiInputBase: {
        input: {
          '&::placeholder': {
            opacity: 1,
            // color: colors.blueGrey[600]
          }
        }
      },  
     
    },
    palette: {
      type: 'light',
      action: {
        active: colors.blueGrey[600]
      },
      background: {
        default: colors.common.white,
        dark: '#f4f6f8',
        paper: colors.common.white
      },
      primary: {
        main: '#002f83',
        contrastText:'#ffffff'
      },
    
      secondary: {
        main: '#147efb',
        contrastText:'#ffffff'
      },
      info: {
        main: '#147efb',
        contrastText:'#ffffff'
      },

      //::custom
      text: {
        primary: colors.blueGrey[900],
        secondary: colors.blueGrey[600]
      },

      bgs:{
        azn:"#232f3E",
        azn_light:"#1f344d",
        azn_dark:"#131A22",
        fb_gray:"#E9EBEE",
        babyPower:"#FEFEFA",
        light:"#ffffff"
      },
   

      error:{
        main: "#d63384"
      },
      success:{
        main: "#20c997"
      }

    },

    borderRadius:'12em',
    shadows: softShadows
  },
  {
    name: THEMES.ONE_DARK,
    palette: {
      type: 'dark',
      action: {
        active: 'rgba(255, 255, 255, 0.54)',
        hover: 'rgba(255, 255, 255, 0.04)',
        selected: 'rgba(255, 255, 255, 0.08)',
        disabled: 'rgba(255, 255, 255, 0.26)',
        disabledBackground: 'rgba(255, 255, 255, 0.12)',
        focus: 'rgba(255, 255, 255, 0.12)'
      },
      background: {
        default: '#282C34',
        dark: '#1c2025',
        paper: '#282C34'
      },
      primary: {
        main: '#8a85ff'
      },
      secondary: {
        main: '#8a85ff'
      },
      text: {
        primary: '#e6e5e8',
        secondary: '#adb0bb',

      }
    },
    shadows: strongShadows
  },
 
];

export const createTheme = (config = {}) => {
  let themeOptions = themesOptions.find((theme) => theme.name === config.theme);

  if (!themeOptions) {
    console.warn(new Error(`The theme ${config.theme} is not valid`));
    [themeOptions] = themesOptions;
  }

  let theme = createMuiTheme(
    _.merge(
      {},
      baseOptions,
      themeOptions,
      { direction: config.direction }
    ),
    esES
  );

  if (config.responsiveFontSizes) {
    theme = responsiveFontSizes(theme);
  }

  return theme;
}


const palette = themesOptions[0].palette

export {palette}
