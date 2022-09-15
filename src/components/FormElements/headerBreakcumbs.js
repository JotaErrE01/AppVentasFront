import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Link, Typography, Breadcrumbs } from '@material-ui/core';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

const HeaderBreakcumbs = ({
	route,
	routename1,
	routename2,
	titlepageName,
	titlepageLastName,
	handleDelete,
	onClickRoute1
}) => {
	return (
		<div>
			<Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
				{route ? (
					<Link onClick={handleDelete} variant="body1" color="inherit" to={route} component={RouterLink}>
						{routename1}
					</Link>
				) : (
					<Link
						onClick={onClickRoute1 ? onClickRoute1 : () => {}}
						variant="body1"
						color="inherit"
						component={RouterLink}
					>
						{routename1}
					</Link>
				)}
				<Typography onClick={handleDelete} variant="body1" color="textPrimary">
					{routename2}
				</Typography>
			</Breadcrumbs>
			<Typography variant="h3" color="textPrimary">
				{titlepageName} {titlepageLastName}
			</Typography>
		</div>
	);
};

export default HeaderBreakcumbs;
