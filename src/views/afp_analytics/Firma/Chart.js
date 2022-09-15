import React from 'react';
import PropTypes from 'prop-types';

import { ResponsiveLine } from '@nivo/line';

function Chart({ labels, payload }) {
	let data = [];
	payload.forEach((pl) => {
		let dataset = [];

		labels.forEach((lb) => {
			dataset = [ ...dataset, { x: lb, y: pl[lb.split(' ').join('_')] } ];
		});

		data = [ ...data, { id: pl.nombre, data: dataset } ];
	});

	return (
		<div style={{ height: '60vh' }}>
			<ResponsiveLine
				data={data}
				margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
				xScale={{ type: 'point' }}
				yScale={{ type: 'linear', min: 'auto', max: 'auto' }}
				curve="cardinal"
				// yFormat=">+.1d"
				axisTop={null}
				axisRight={null}
				axisBottom={{
					orient: 'bottom',
					tickSize: 5,
					tickPadding: 5,
					tickRotation: 0,
					legend: 'Periodo',
					legendOffset: 36,
					legendPosition: 'middle'
				}}
				axisLeft={{
					orient: 'left',
					tickSize: 5,
					tickPadding: 5,
					tickRotation: 0,
					legend: 'Cantidad',
					legendOffset: -40,
					legendPosition: 'middle'
				}}
				pointSize={10}
				pointColor={{ theme: 'background' }}
				pointBorderWidth={2}
				pointBorderColor={{ from: 'serieColor' }}
				pointLabelYOffset={-12}
				useMesh={true}
				legends={[
					{
						anchor: 'top',
						direction: 'row',
						justify: false,
						translateX: 90,
						translateY: 0,
						itemsSpacing: 0,
						itemDirection: 'left-to-right',
						itemWidth: 120,
						itemHeight: 20,
						itemOpacity: 0.75,
						symbolSize: 12,
						symbolShape: 'circle',
						symbolBorderColor: 'rgba(0, 0, 0, .5)',
						effects: [
							{
								on: 'hover',
								style: {
									itemBackground: 'rgba(0, 0, 0, .03)',
									itemOpacity: 1
								}
							}
						]
					}
				]}
			/>
		</div>
	);
}

Chart.propTypes = {
	payload: PropTypes.array,
	labels: PropTypes.array
};

export default Chart;
