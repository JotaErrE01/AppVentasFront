import React, { useRef, useState } from 'react';
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
import { FilterForm } from './FilterForm';

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
			new String(arrayItem.estado).toUpperCase().indexOf(new String(comparators.estado).toUpperCase()) >= 0
		);
	});

	return result;
}

const CatalogoMaestroTable = ({
	className,
	catalogos,
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
	const [ orderBy, setOrderBy ] = useState('cat_descripcion');

	const [ opens, setOpens ] = useState(
		new Array(3).fill(false).map(() => {
			return false;
		})
	);

	const [ textComparators, setTextComparators ] = useState({
		cat_id: '',
		cat_descripcion: '',
		estado: ''
	});

	const ref_0 = useRef(null);
	const ref_1 = useRef(null);
	const ref_2 = useRef(null);

	const handlePageChange = (event, newPage) => {
		setPage(newPage);
	};

	const handleLimitChange = (event) => {
		setLimit(parseInt(event.target.value));
	};

	const paginatedCatalogos = applyPagination(catalogos, page, limit);

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
								{/* <TableCell>
									<TableSortLabel
										IconComponent={ChevronsDownIcon}
										active={orderBy === 'cat_id'}
										direction={orderBy === 'cat_id' ? order : 'asc'}
										onClick={createSortHandler('cat_id')}
									>
										CAT_ID
									</TableSortLabel>
								</TableCell> */}
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
										ESTADO
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
				count={catalogos.length}
				onChangePage={handlePageChange}
				onChangeRowsPerPage={handleLimitChange}
				page={page}
				rowsPerPage={limit}
				rowsPerPageOptions={[ 5, 10, 25 ]}
			/>
		</Card>
	);
};

CatalogoMaestroTable.propTypes = {
	className: PropTypes.string,
	catalogos: PropTypes.array.isRequired,
	onSubmit: PropTypes.func,
	editing: PropTypes.bool,
	onCancelEditing: PropTypes.func,
	isLoading: PropTypes.bool,
	editingId: PropTypes.number,
	onSelectRowToEdit: PropTypes.func,
	onSelectRowToDelete: PropTypes.func
};

CatalogoMaestroTable.defaultProps = {
	catalogos: [],
	onSubmit: () => {},
	editing: false,
	onCancelEditing: () => {},
	isLoading: false,
	onSelectRowToEdit: () => {},
	onSelectRowToDelete: () => {}
};

export default CatalogoMaestroTable;
