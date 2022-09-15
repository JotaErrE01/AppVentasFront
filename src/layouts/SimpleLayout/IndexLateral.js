import React, { useEffect } from 'react'
import { useDispatch } from 'src/store';

import {
    Container,
    makeStyles,
    Box,
    Breadcrumbs,
    Link,
    List,
    ListItem,
    Button,
    ListSubheader

} from '@material-ui/core';

import Page from 'src/components/Page';
import { Link as RouterLink } from 'react-router-dom';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { actionRenderTabOnCreate } from 'src/slices/fondos';
import { getListarOportunidades, setCreateOportunity, setOportunidad } from 'src/slices/clientes';
import TableChartIcon from '@material-ui/icons/TableChart';
import useAuth from 'src/contextapi/hooks/useAuth';


import { BiHome, BiDollar, BiUserCheck, BiBookContent, BiChart } from 'react-icons/bi'


export const MapIcon = ({ icon, className }) => {
    switch (icon) {
        case "home": return <BiHome className={className} />
        case "dollar": return <BiDollar className={className} />
        case "user_check": return <BiUserCheck className={className} />
        case "book_content": return <BiBookContent className={className} />
        case "analytics": return <BiChart className={className} />
        default: return <></>
    }
};



export const menuList = [
    {
        id: "0",
        title: 'Inicio ',
        description: null,
        icon: 'home',
        route: '/',
        codigo: null,
        guard: 'read_sales',
    },

    {
        id: "1",
        title: 'Oportunidades ',
        description: 'Registro e información de contratos',
        icon: 'dollar',
        route: '/afp/crm/oportunidad',
        codigo: 'verOportunidad',
        guard: 'read_sales',
    },
    {
        id: "2",
        title: 'Actividades',
        description: 'Registra prospectos y actividades.',
        icon: 'user_check',
        route: '/afp/prospecto',
        codigo: '',
        guard: 'read_prospects',
    },

    {
        id: "3",
        title: 'Archivos',
        description: 'Tripticos y material venta',
        icon: 'book_content',
        route: '/afp/sharepoint',
        codigo: '',
        guard: 'read_sharepoint_files',

    },
    {
        id: "4",
        title: 'Reportes',
        description: '',
        icon: 'analytics',
        route: '/afp/analytics',
        codigo: '',
        guard: 'sales_reports',

    },


    // {
    //     id:"5",
    //     title: 'Carga',
    //     description: 'Carga de prospectos',
    //     icon: 'carga',
    //     route: '/afp/prospectos/carga',
    //     codigo: '',
    //     guard: 'sales_reports',
    // }
];



// 


const IndexLateral = () => {
    const classes = useStyles();

    const dispatch = useDispatch();
    const { user, role } = useAuth();

    useEffect(() => {
        dispatch(setOportunidad({}));
        // dispatch(getDeleteInformationWithRefuse({}));
    }, []);


    const actionSelect = (option) => {
        dispatch(actionRenderTabOnCreate(option));
        dispatch(setCreateOportunity(true));
        if (option === 'verOportunidad') {
            dispatch(getListarOportunidades());
        }
    };



    const guards = user.permisos && user.permisos.map(item => item.guard);

    const guarded = menuList.filter(item => guards.includes(item.guard));



    return (

        <>
            <Box p={2}>
                <List >
                    {
                        guarded.map((item) => {
                            return (
                                <ListItem key={item.id}>
                                    <Button
                                        component={RouterLink}
                                        to={item.route || "/"}
                                        onClick={() => actionSelect(item.codigo)}
                                        startIcon={<MapIcon icon={item.icon} iconClass={classes.icon} />}
                                        className={classes.buttonView}
                                    >
                                        <Box className={classes.buttonBody} >
                                            <span>{item.title}</span>
                                        </Box>
                                    </Button>
                                </ListItem>
                            )
                        })

                    }
                    {
                        role === 'admin' &&
                        <ListItem ListItem>
                            <Button
                                component={RouterLink}
                                to={'/logs'}
                                startIcon={<TableChartIcon />}
                                className={classes.buttonView}
                            >
                                <Box className={classes.buttonBody} >
                                    <span>{'Revisar Auditorías'}</span>
                                </Box>
                            </Button>
                        </ListItem>
                    }
                </List>
            </Box>
        </>

    );
};

export default IndexLateral;


const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.primary.contrastText,
    },
    buttonView: {
        width: '100%',
        justifyContent: 'flex-start',
        padding: '.6em',
    },
    buttonBody: {
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'initial',
        width: '100%',
    },
    buttonSubtitle: {
        fontSize: '.72em'
    }
}));