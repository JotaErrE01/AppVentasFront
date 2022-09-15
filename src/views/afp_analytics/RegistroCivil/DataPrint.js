import { Box, Card, CardHeader, IconButton, CardContent, Grid } from '@material-ui/core';
import { Print } from '@material-ui/icons';
import DataTable from './DataTable';
import React, { useRef } from 'react';
import Logo from 'src/components/Logo';

const DataPrint = ({
    titulo,
    periodo,
    data,
    loading,
    dateFormat
}) => {

    const printRef = useRef();

    return (
        <>
            <Box mt={3}>
                <Card >
                    <CardHeader
                        title={titulo}
                        subheader={periodo}
                        action={ <IconButton aria-label="settings"> <Print /></IconButton>  }
                    />
                    <CardContent>
                        <DataTable
                            agrupadoMes
                            data={data}
                            loading={loading}
                            dateFormat={dateFormat}
                        />
                    </CardContent>
                </Card>
            </Box>
            <div style={{ visibility: 'hidden', height: '0' }}>
                <ComponentToPrint
                    ref={printRef}
                    titulo={titulo}
                    periodo={periodo}
                    data={data}
                    loading={loading}
                    dateFormat={dateFormat}
                />
            </div>
        </>
    )
};


const ComponentToPrint = React.forwardRef(
    ({ titulo, periodo, data, loading, action, dateFormat }, ref,

    ) => {
        return (
            <div ref={ref}>
                <Box p={3}>
                    <Grid>
                        <Grid item>
                            <Logo src="/static/logos/genesis_logo_blue_full.svg" />
                        </Grid>
                    </Grid>
                </Box>
                <Card >
                    <CardHeader action={action} title={titulo} subheader={periodo} />
                    <CardContent>
                        <DataTable
                            agrupadoMes
                            data={data}
                            loading={loading}
                            dateFormat={dateFormat}
                        />
                    </CardContent>
                 

                </Card>
            </div>
        );
    });

export default DataPrint;
export { ComponentToPrint }
