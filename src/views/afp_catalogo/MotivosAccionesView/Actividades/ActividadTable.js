import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
	Box,
	Button,
	Card,
	IconButton,
	SvgIcon,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TablePagination,
	TableRow,
	makeStyles,
	Popover
} from '@material-ui/core';
import { Edit as EditIcon, Trash as TrashIcon } from 'react-feather';
import EditRow from './EditRow';
import { FilterForm } from '../FilterForm';

const applyPagination = (customers, page, limit) => {
	return customers.slice(page * limit, page * limit + limit);
};

const descendingComparator = (a, b, orderBy) => {
	if (b[orderBy] < a[orderBy]) {
		return -1;
	}

	if (b[orderBy] > a[orderBy]) {
		return 1;
	}

	return 0;
};

const getComparator = (order, orderBy) => {
	return order === 'desc'
		? (a, b) => descendingComparator(a, b, orderBy)
		: (a, b) => -descendingComparator(a, b, orderBy);
};

const useStyles = makeStyles((theme) => ({
	root: {},
	popover: {
		width: 320,
		padding: theme.spacing(2)
	}
}));

function stableSort(array, comparator) {
	const stabilizedThis = array.map((el, index) => [ el, index ]);
	stabilizedThis.sort((a, b) => {
		const order = comparator(a[0], b[0]);
		if (order !== 0) return order;
		return a[1] - b[1];
	});
	return stabilizedThis.map((el) => el[0]);
}

function textFilter(array, comparators) {
	let result = [];

	result = array.filter((arrayItem) => {
		return (
			new String(arrayItem.cat_id).toUpperCase().indexOf(new String(comparators.cat_id).toUpperCase()) >= 0 &&
			new String(arrayItem.cat_descripcion)
				.toUpperCase()
				.indexOf(new String(comparators.cat_descripcion).toUpperCase()) >= 0 &&
			new String(arrayItem.codigo).toUpperCase().indexOf(new String(comparators.codigo).toUpperCase()) >= 0 &&
			new String(arrayItem.contenido).toUpperCase().indexOf(new String(comparators.contenido).toUpperCase()) >=
				0 &&
			new String(arrayItem.contenido_2)
				.toUpperCase()
				.indexOf(new String(comparators.contenido_2).toUpperCase()) >= 0 &&
			new String(arrayItem.contenido_3)
				.toUpperCase()
				.indexOf(new String(comparators.contenido_3).toUpperCase()) >= 0 &&
			new String(arrayItem.orden_estricto)
				.toUpperCase()
				.indexOf(new String(comparators.orden_estricto).toUpperCase()) >= 0 &&
			new String(arrayItem.estado).toUpperCase().indexOf(new String(comparators.estado).toUpperCase()) >= 0
		);
	});

	return result;
}

const ActividadTable = ({
	className,
	actividades,
	onSubmit,
	editing,
	onCancelEditing,
	isLoading,
	editingId,
	onSelectRowToEdit,
	onSelectRowToDelete,
	...rest
}) => {
	const classes = useStyles();
	const [ page, setPage ] = useState(0);
	const [ limit, setLimit ] = useState(10);

	const [ order, setOrder ] = useState('asc');
	const [ orderBy, setOrderBy ] = useState('contenido');

	const [ opens, setOpens ] = useState(
		new Array(8).fill(false).map(() => {
			return false;
		})
	);

	const [ textComparators, setTextComparators ] = useState({
		cat_id: '',
		cat_descripcion: '',
		codigo: '',
		contenido: '',
		contenido_2: '',
		contenido_3: '',
		orden_estricto: '',
		estado: ''
	});

	const ref_0 = useRef(null);
	const ref_1 = useRef(null);
	const ref_2 = useRef(null);
	const ref_3 = useRef(null);
	const ref_4 = useRef(null);
	const ref_5 = useRef(null);
	const ref_6 = useRef(null);
	const ref_7 = useRef(null);

	const handlePageChange = (event, newPage) => {
		setPage(newPage);
	};

	const handleLimitChange = (event) => {
		setLimit(parseInt(event.target.value));
	};

	const paginatedCatalogos = applyPagination(actividades, page, limit);

	const handleRequestSort = (property, orderMode) => {
		// const isAsc = orderBy === property && order === 'asc';
		setOrder(orderMode);
		setOrderBy(property);
	};

	const handleOpen = (indexOpen) => {
		setOpens(
			opens.map((_, index) => {
				return indexOpen == index ? true : false;
			})
		);
	};

	const handleClose = () => {
		setOpens([ ...opens.map((_) => false) ]);
	};

	const handleComparatorsChange = (event) => {
		event.preventDefault();
		textComparators[event.target.name] = event.target.value;
		setTextComparators({ ...textComparators });
	};

	return (
		<Card className={clsx(classes.root, className)} {...rest}>
			<PerfectScrollbar>
				<Box minWidth={700}>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>
									<Button ref={ref_0} onClick={() => handleOpen(0)}>
										CAT_ID
									</Button>
									<Popover
										anchorOrigin={{
											vertical: 'bottom',
											horizontal: 'center'
										}}
										classes={{ paper: classes.popover }}
										anchorEl={ref_0.current}
										onClose={() => handleClose(0)}
										open={opens[0]}
									>
										<FilterForm
											valueRef="cat_id"
											orderBy={orderBy}
											orderMode={order}
											textFilter={textComparators.cat_id}
											onSort={(orderBy, orderMode) => handleRequestSort(orderBy, orderMode)}
											onTextFilterChange={(event) => handleComparatorsChange(event)}
										/>
									</Popover>
								</TableCell>
								<TableCell>
									<Button ref={ref_1} onClick={() => handleOpen(1)}>
										CATÁLOGO
									</Button>
									<Popover
										anchorOrigin={{
											vertical: 'bottom',
											horizontal: 'center'
										}}
										classes={{ paper: classes.popover }}
										anchorEl={ref_1.current}
										onClose={() => handleClose(1)}
										open={opens[1]}
									>
										<FilterForm
											valueRef="cat_descripcion"
											orderBy={orderBy}
											orderMode={order}
											textFilter={textComparators.cat_descripcion}
											onSort={(orderBy, orderMode) => handleRequestSort(orderBy, orderMode)}
											onTextFilterChange={(event) => handleComparatorsChange(event)}
										/>
									</Popover>
								</TableCell>
								<TableCell>
									<Button ref={ref_2} onClick={() => handleOpen(2)}>
										CÓDIGO
									</Button>
									<Popover
										anchorOrigin={{
											vertical: 'bottom',
											horizontal: 'center'
										}}
										classes={{ paper: classes.popover }}
										anchorEl={ref_2.current}
										onClose={() => handleClose(2)}
										open={opens[2]}
									>
										<FilterForm
											valueRef="codigo"
											orderBy={orderBy}
											orderMode={order}
											textFilter={textComparators.codigo}
											onSort={(orderBy, orderMode) => handleRequestSort(orderBy, orderMode)}
											onTextFilterChange={(event) => handleComparatorsChange(event)}
										/>
									</Popover>
								</TableCell>
								<TableCell>
									<Button ref={ref_3} onClick={() => handleOpen(3)}>
										CONTENIDO
									</Button>
									<Popover
										anchorOrigin={{
											vertical: 'bottom',
											horizontal: 'center'
										}}
										classes={{ paper: classes.popover }}
										anchorEl={ref_3.current}
										onClose={() => handleClose(3)}
										open={opens[3]}
									>
										<FilterForm
											valueRef="contenido"
											orderBy={orderBy}
											orderMode={order}
											textFilter={textComparators.contenido}
											onSort={(orderBy, orderMode) => handleRequestSort(orderBy, orderMode)}
											onTextFilterChange={(event) => handleComparatorsChange(event)}
										/>
									</Popover>
								</TableCell>
								<TableCell>
									<Button ref={ref_4} onClick={() => handleOpen(4)}>
										CONTENIDO_2
									</Button>
									<Popover
										anchorOrigin={{
											vertical: 'bottom',
											horizontal: 'center'
										}}
										classes={{ paper: classes.popover }}
										anchorEl={ref_4.current}
										onClose={() => handleClose(4)}
										open={opens[4]}
									>
										<FilterForm
											valueRef="contenido_2"
											orderBy={orderBy}
											orderMode={order}
											textFilter={textComparators.contenido_2}
											onSort={(orderBy, orderMode) => handleRequestSort(orderBy, orderMode)}
											onTextFilterChange={(event) => handleComparatorsChange(event)}
										/>
									</Popover>
								</TableCell>
								<TableCell>
									<Button ref={ref_5} onClick={() => handleOpen(5)}>
										CONTENIDO_3
									</Button>
									<Popover
										anchorOrigin={{
											vertical: 'bottom',
											horizontal: 'center'
										}}
										classes={{ paper: classes.popover }}
										anchorEl={ref_5.current}
										onClose={() => handleClose(5)}
										open={opens[5]}
									>
										<FilterForm
											valueRef="contenido_3"
											orderBy={orderBy}
											orderMode={order}
											textFilter={textComparators.contenido_3}
											onSort={(orderBy, orderMode) => handleRequestSort(orderBy, orderMode)}
											onTextFilterChange={(event) => handleComparatorsChange(event)}
										/>
									</Popover>
								</TableCell>
								<TableCell>
									<Button ref={ref_6} onClick={() => handleOpen(6)}>
										ORDEN
									</Button>
									<Popover
										anchorOrigin={{
											vertical: 'bottom',
											horizontal: 'center'
										}}
										classes={{ paper: classes.popover }}
										anchorEl={ref_6.current}
										onClose={() => handleClose(6)}
										open={opens[6]}
									>
										<FilterForm
											valueRef="orden_estricto"
											orderBy={orderBy}
											orderMode={order}
											textFilter={textComparators.orden_estricto}
											onSort={(orderBy, orderMode) => handleRequestSort(orderBy, orderMode)}
											onTextFilterChange={(event) => handleComparatorsChange(event)}
										/>
									</Popover>
								</TableCell>
								<TableCell>
									<Button ref={ref_7} onClick={() => handleOpen(7)}>
										ESTADO
									</Button>
									<Popover
										anchorOrigin={{
											vertical: 'bottom',
											horizontal: 'center'
										}}
										classes={{ paper: classes.popover }}
										anchorEl={ref_7.current}
										onClose={() => handleClose(7)}
										open={opens[7]}
									>
										<FilterForm
											valueRef="estado"
											orderBy={orderBy}
											orderMode={order}
											textFilter={textComparators.estado}
											onSort={(orderBy, orderMode) => handleRequestSort(orderBy, orderMode)}
											onTextFilterChange={(event) => handleComparatorsChange(event)}
										/>
									</Popover>
								</TableCell>
								<TableCell>
									<SvgIcon fontSize="small">
										<EditIcon />
									</SvgIcon>
								</TableCell>
								<TableCell>
									<SvgIcon fontSize="small">
										<TrashIcon />
									</SvgIcon>
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{editing && (
								<EditRow onSubmit={onSubmit} onCancelEditing={onCancelEditing} isLoading={isLoading} />
							)}

							{stableSort(
								textFilter(paginatedCatalogos, textComparators),
								getComparator(order, orderBy)
							).map((catalogo) => {
								let isEditingRow = catalogo.id == editingId;

								if (!isEditingRow)
									return (
										<TableRow hover key={catalogo.id}>
											<TableCell>{catalogo.cat_id}</TableCell>
											<TableCell>{catalogo.cat_descripcion}</TableCell>
											<TableCell>{catalogo.codigo}</TableCell>
											<TableCell>{catalogo.contenido}</TableCell>
											<TableCell>{catalogo.contenido_2}</TableCell>
											<TableCell>{catalogo.contenido_3}</TableCell>
											<TableCell>{catalogo.orden_estricto}</TableCell>
											<TableCell>{catalogo.estado}</TableCell>
											<TableCell>
												<IconButton onClick={() => onSelectRowToEdit(catalogo.id)}>
													<SvgIcon fontSize="small">
														<EditIcon />
													</SvgIcon>
												</IconButton>
											</TableCell>
											<TableCell>
												<IconButton onClick={() => onSelectRowToDelete(catalogo.id)}>
													<SvgIcon fontSize="small">
														<TrashIcon />
													</SvgIcon>
												</IconButton>
											</TableCell>
										</TableRow>
									);
								else
									return (
										<EditRow
											key={catalogo.id}
											onSubmit={onSubmit}
											initData={catalogo}
											onCancelEditing={() => onSelectRowToEdit(null)}
											isLoading={isLoading}
										/>
									);
							})}
						</TableBody>
					</Table>
				</Box>
			</PerfectScrollbar>
			<TablePagination
				component="div"
				count={actividades.length}
				onChangePage={handlePageChange}
				onChangeRowsPerPage={handleLimitChange}
				page={page}
				rowsPerPage={limit}
				rowsPerPageOptions={[ 5, 10, 25 ]}
			/>
		</Card>
	);
};

ActividadTable.propTypes = {
	className: PropTypes.string,
	actividades: PropTypes.array.isRequired,
	onSubmit: PropTypes.func,
	editing: PropTypes.bool,
	onCancelEditing: PropTypes.func,
	isLoading: PropTypes.bool,
	editingId: PropTypes.number,
	onSelectRowToEdit: PropTypes.func,
	onSelectRowToDelete: PropTypes.func
};

ActividadTable.defaultProps = {
	actividades: [],
	onSubmit: () => {},
	editing: false,
	onCancelEditing: () => {},
	isLoading: false,
	onSelectRowToEdit: () => {},
	onSelectRowToDelete: () => {}
};

export default ActividadTable;
