import * as React from 'react';
import PropTypes from 'prop-types';
import { Box, Tab, Tabs, Typography } from '@material-ui/core';


function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function TabsLayout({ children }) {
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="CONSOLIDADO" {...a11yProps(2)} />
                    <Tab label="MENSUAL" {...a11yProps(0)} />
                    <Tab label="DIARIO" {...a11yProps(1)} />
                    <Tab label="LOCALIDAD" {...a11yProps(3)} />
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                {children[0]}
            </TabPanel>
            <TabPanel value={value} index={1}>
                {children[1]}
            </TabPanel>
            <TabPanel value={value} index={2}>
                {children[2]}
            </TabPanel>
            <TabPanel value={value} index={3}>
                {children[3]}
            </TabPanel>
        </Box>
    );
}