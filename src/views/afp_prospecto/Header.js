import React from 'react'
import {
    Container, Grid, Typography, Breadcrumbs, Link,
    makeStyles,
    Button,
    SvgIcon
} from '@material-ui/core';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import Buttons from 'src/components/common/Buttons'
import Page from 'src/components/Page';
import { Link as RouterLink } from 'react-router-dom';
import ToggleProspecto from './ToggleProspecto';
import { Edit as EditIcon, Filter, Plus as CreateIcon } from 'react-feather';
import { Filter1Rounded, PersonAddRounded } from '@material-ui/icons';


const Header = ({
    grabbed,
    grabbedLength,
    creating,
    editing,
    onDelete,
    onEmbudoOpen,
    setModalCrear
}) => {
    const classes = useStyles();

    return (
        <Page className={classes.root} title="Embudo de ventas" >

            <Container maxWidth="xl">
                <Grid container spacing={3} justify="space-between">
                    <Grid item>
                        <ToggleProspecto />

                        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
                            <Link variant="body1" color="inherit" to="/afp/ventas" component={RouterLink}>
                                Ventas
                            </Link>
                            <Link variant="body1" color="inherit" to="/afp/prospecto" component={RouterLink}>
                                Prospecto
                            </Link>
                        </Breadcrumbs>
                    </Grid>
                    <Grid item>
                        <Grid container spacing={2} justify="flex-end">
                            <Grid item>
                                <Button
                                    onClick={onEmbudoOpen}
                                    disabled={!(grabbedLength)}
                                    color="primary"
                                    variant="contained"
                                    endIcon={<Filter />}
                                    size="small"
                                >
                                    Crear ( {grabbedLength} ) leads
                                </Button>
                            </Grid>

                            <Grid item>
                                <Button
                                    onClick={() => setModalCrear(true)}
                                    disabled={creating}
                                    color="secondary" variant="contained"
                                    size="small"
                                    endIcon={<SvgIcon fontSize="small"> <PersonAddRounded /> </SvgIcon>} >
                                    Nuevo
                        </Button>
                            </Grid>
                        </Grid>


                    </Grid>
                </Grid>
            </Container>

        </Page>
    )
}

export default Header
const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.dark,
        // minHeight: '100%',
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3)
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
    paper: {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3),
        background: theme.palette.primary.contrastText
    }
}));

