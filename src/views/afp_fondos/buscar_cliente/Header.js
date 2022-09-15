import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Button, Link, Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import CloseIcon from '@material-ui/icons/Close';

const Header = ({ header, classTitle, handleDelete, goBack }) => {
	return (
		<Grid item xs container direction="row" justify="space-between">
			<Typography className={classTitle} color="textSecondary" gutterBottom>
				{header}
			</Typography>
			<Link component={Button} onClick={goBack ? goBack : () => {}}>
				<CloseIcon onClick={handleDelete} style={{ color: 'black' }} />
			</Link>
		</Grid>
	);
};

export default Header;
