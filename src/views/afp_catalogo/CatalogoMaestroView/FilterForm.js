import { List, Grid, ListItem, ListItemIcon, ListItemText, TextField, Divider, Badge } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import React from 'react';

import { ChevronsDown as ChevronsDownIcon, ChevronsUp as ChevronsUpIcon, Filter as FilterIcon } from 'react-feather';

export const FilterForm = ({ valueRef, orderBy, orderMode, textFilter, onSort, onTextFilterChange }) => {
	const classes = useStyles();

	return (
		<List aria-label="main mailbox folders">
			<ListItem button onClick={() => onSort(valueRef, 'asc')}>
				<ListItemIcon>
					{valueRef == orderBy && orderMode == 'asc' ? (
						<Badge color="primary" variant="dot">
							<ChevronsUpIcon />
						</Badge>
					) : (
						<ChevronsUpIcon />
					)}
				</ListItemIcon>
				<ListItemText primary="Ordenar de A-Z" />
			</ListItem>
			<Divider />
			<ListItem button onClick={() => onSort(valueRef, 'desc')}>
				<ListItemIcon>
					{valueRef == orderBy && orderMode == 'desc' ? (
						<Badge color="primary" variant="dot">
							<ChevronsDownIcon />
						</Badge>
					) : (
						<ChevronsDownIcon />
					)}
				</ListItemIcon>
				<ListItemText primary="Ordenar de Z-A" />
			</ListItem>
			<Divider />
			<ListItem>
				<ListItemIcon>
					<FilterIcon />
				</ListItemIcon>
				<ListItemText primary="Filtrar por" />
			</ListItem>
			<ListItem>
				<Grid>
					<Grid item>
						<TextField
							className={classes.search}
							fullWidth
							placeholder="Filtro"
							// error={Boolean(errors.cat_id)}
							// helperText={errors.cat_id}
							// label="Cat_id"
							name={valueRef}
							// disabled={isLoading}
							onChange={onTextFilterChange}
							type="text"
							value={textFilter}
							variant="outlined"
							// disabled
						/>
					</Grid>
				</Grid>
			</ListItem>
		</List>
	);
};

const useStyles = makeStyles((theme) => ({
	btnTodosNinguno: { color: '#2196F3' },
	search: { width: '100%' },
	checkIcon: { color: '#3D4852' }
}));
