import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Breadcrumbs,
  Button,
  Grid,
  Link,
  SvgIcon,
  Typography,
  makeStyles
} from '@material-ui/core';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { PlusCircle as PlusIcon } from 'react-feather';

const useStyles = makeStyles(() => ({
  root: {}
}));

const Header = ({
    title,
    current,
  handleAdd,
  className, ...rest }) => {
  const classes = useStyles();

  return (
    <Grid
      alignItems="center"
      container
      justify="space-between"
      spacing={3}
      className={clsx(classes.root, className)}
     
    >
      <Grid item>
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
        >
         
         <Link variant="body1" color="inherit" to="/afp/ventas" component={RouterLink} > Ventas </Link>


         <Typography variant="body1" color="textPrimary" > Mantenimiento de Clientes </Typography>

         
        </Breadcrumbs>

        <Typography variant="h3" color="textPrimary" >
          {current}
        </Typography>
      </Grid>
     
     
     
      <Grid item>
        <Button
          color="secondary"
          component={RouterLink}
          onClick={handleAdd}
          variant="contained"
          startIcon={
            <SvgIcon fontSize="small">
              <PlusIcon />
            </SvgIcon>
          }
        >
          Agregar un evento
        </Button>
      </Grid>
    </Grid>
  );
}

Header.propTypes = {
  className: PropTypes.string
};

export default Header;