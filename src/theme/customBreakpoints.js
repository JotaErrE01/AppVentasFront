

const THEME_COLORS = {
    light: {
        primary: {
            main: '#002f83',
            contrastText: '#ffffff'
        },
        secondary: {
            main: '#74C748',
            contrastText: '#ffffff'

        },

        text: {
            paragraph: '#232f3e',
            titles: '#131a22',
        },
        bg: {
            main:'#ffffff',
            alt:'#f2f2f2'
        },
        line: '#f5f5f5'

    },

    dark: {
        primary: {
            main: '#8F50BA',
            contrastText: '#ffffff'
        },
        secondary: {
            main: '#74C748',
            contrastText: '#ffffff'

        },
        text: {
            paragraph: '#FCF8FF',
            titles: '#FCF8FF',
        },
        bg: {
            alt:'#000000',
            main:'#161625'
        },
        line: '#1c1c1e'
    },

   


   alerts:{
    danger: {
        main: '#FA3E3E',
        contrastText: '#ffffff'
    },
    warning: {
        main: '#F0AD4E',
        contrastText: '#ffffff'
    },
    success: {
        main: '#5cb85c',
        contrastText: '#ffffff'
    },
    info: {
        main: '#006c70',
        contrastText: '#ffffff'
    },

   }
    



}






const CSS_HELPERS_REACT = {
    CENTER: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    CENTER_VERTICAL: {
        display: 'flex',
        alignItems: 'center',
    },
    TRUNCATE: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    },
    BOX_SHADOW: {
        boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px "
    },
    RADIUS: {
        borderRadius: '.9em'
    }



};

const CSS_HELPERS = {
    CENTER: `
            display:flex;
            align-items: center;
            flex-direction:row;
        `,
    CENTER_HORIZONTAL: `
            display:flex;
            justify-content: center;
        `,
    ROUNDED: `border-radius:9pt`,
    BOX_SHADOW: `
        box-shadow: 0 2px 5px 0 rgba(0,0,0,0.05);
        transition-duration: 172ms;
        will-change: transform, box-shadow;  
        `
    ,

    BOX_SHADOW_TOP: `
    box-shadow: 0 -3px 5px 0 rgba(0,0,0,0.05);
    transition-duration: 172ms;
    will-change: transform, box-shadow;  
    `
,

    RADIUS_MD: `border-radius:.9em`,
    BUTTON_BASE: `
        cursor:pointer;
        position:relative;
        border: 0;
        outline: none;
        vertical-align: middle;
        justify-content: center;
        padding: 0;
        margin: 0;
        display: inline-flex;
    `
};

const CSS_FONTS = {
    SIZES: {
        MENU: '.9em',
        H1: '2.5rem',
        H2: '2rem',
        H3: '1.75rem',
        H4: '1.5rem',
        H5: '1.25rem',
        H6: '1rem',
        MD: '1.2rem',
        SM: '.9rem',
    },
    FAMILY: {
        TITLE: {
            URL: "https://fonts.googleapis.com/css?family=Lato&display=swap",
            FAMILY: "'Lato', sans-serif"
        },
        BODY: {
            URL: "https://fonts.googleapis.com/css?family=Nunito+Sans&display=swap",
            FAMILY: "'Nunito Sans', sans-serif"
        }

    },

};

const MEDIA_SCREENS = {
    XS: {
        FROM: '0',
        TO: '500',
    },
    SMALL: {
        FROM: '500',
        TO: '768',
    },
    MEDIUM: {
        FROM: '768',
        TO: '4000',
    },
};


export  {
    CSS_HELPERS_REACT,
    CSS_HELPERS,
    CSS_FONTS,
    MEDIA_SCREENS, 
    THEME_COLORS
}

