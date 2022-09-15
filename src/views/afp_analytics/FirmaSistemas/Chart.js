import React from 'react';
import { ResponsiveLine } from '@nivo/line';
import JSONTree from 'react-json-tree';

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.



const parsedData = (data) => {

    const results = [
        {
            id: 'ENVIADO',
            data: data.map(item => {
                return {
                    x: item.id,
                    y: item.enviado
                }
            }),
            "color": "hsl(307, 70%, 50%)",

        },
        {
            id: 'FIRMADO',
            data: data.map(item => {
                return {
                    x: item.id,
                    y: item.firmado
                }
            })
        },

    ]
    return results;
}

const Chart = ({ data }) => {

    const _data = parsedData(data);


    return (

        <>

            <div style={{ height: '24em' }}>

                <ResponsiveLine
                    data={_data}
                    margin={{ top: 10, right: 110, bottom: 50, left: 60 }}
                    xScale={{ type: 'point', stacked: false }}
                    yScale={{ type: 'linear', min: 0, max: 'auto', stacked: false, reverse: false }}
                    yFormat=" >-.2f"
                    axisTop={null}
                    axisRight={null}
                    axisBottom={{
                        orient: 'bottom',
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legendOffset: 36,
                        legendPosition: 'middle'
                    }}
                    axisLeft={{
                        orient: 'left',
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: 'CANTIDAD',
                        legendOffset: -40,
                        legendPosition: 'middle'
                    }}
                    pointSize={10}
                    pointBorderWidth={2}
                    pointLabelYOffset={-12}
                    useMesh={true}
                    legends={[
                        {
                            anchor: 'bottom-right',
                            direction: 'column',
                            justify: false,
                            translateX: 100,
                            translateY: 0,
                            itemsSpacing: 0,
                            itemDirection: 'left-to-right',
                            itemWidth: 80,
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
                    
                    curve="natural"
                    colors={['#288FD4', '#ABCC61']}
                    pointBorderColor={{ from: 'serieColor' }}
                    colorBy="index"
                    pointSize={4}
                    enableArea
                />

            </div>
        </>
    )
}

export default Chart;