import React from 'react';
import Page from 'src/components/Page';
import { Container, Breadcrumbs, Link, Typography } from '@material-ui/core';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { Link as RouterLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import Menu from './Menu';

const Index = () => {
	const classes = useStyles();

	return (
		<Page className={classes.root} title="Analitica">
			<Container maxWidth="xl">
				<Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
					<Link variant="body1" color="inherit" to="/afp/ventas" component={RouterLink}>
						Analítica
					</Link>
					<Typography variant="body1" color="textPrimary">
						Reportes
					</Typography>
				</Breadcrumbs>
				<Menu />
			</Container>
		</Page>
	);
};

export default Index;

const useStyles = makeStyles((theme) => ({
	root: {
		backgroundColor: theme.palette.background.dark,
		minHeight: '100%',
		paddingTop: theme.spacing(3),
		paddingBottom: theme.spacing(3)
	}
}));
