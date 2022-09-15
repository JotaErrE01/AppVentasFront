import React from 'react';
import PropTypes from 'prop-types';
import { DataGrid } from '@material-ui/data-grid';
import { DEFAULT_LOCALE_TEXT } from 'src/utils/localeText';

function TableDetalles({ loading, labels, payload }) {
	let columns = [];

	columns = [ ...columns, { field: 'nombre', headerName: 'Origen', width: 380 } ];

	labels.forEach((label) => {
		label.split(' ').join('_');

		columns = [ ...columns, { field: label.split(' ').join('_'), headerName: label, width: 150 } ];
	});

	payload = payload.map((pl, index) => {
		return { ...pl, id: index };
	});

	const config = {
		columns,
		rows: payload
		// sortModel: [
		//     {
		//         field: 'proxima_reunion',
		//         sort: 'desc',
		//         type: 'date'
		//     },
		// ]
	};

	return (
		<div style={{ height: '50vh', width: '100%' }}>
			<DataGrid
				loading={loading}
				rows={config.rows}
				columns={config.columns}
				// sortModel={config.sortModel}
				pageSize={10}
				// onSelectionChange={(newSelection) => {
				// 	setEdit(newSelection.rowIds[0]);
				// }}
				// onRowSelected={({ data }) => {
				// 	setEdit(data.id);
				// }}
				localeText={DEFAULT_LOCALE_TEXT}
			/>
		</div>
	);
}

TableDetalles.propTypes = {
	payload: PropTypes.array,
	labels: PropTypes.array
};

export default TableDetalles;
