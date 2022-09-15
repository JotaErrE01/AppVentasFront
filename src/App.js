import React, { useEffect } from 'react';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { create } from 'jss';
import rtl from 'jss-rtl';
import MomentUtils from '@date-io/moment';
import { SnackbarProvider } from 'notistack';
import { jssPreset, StylesProvider, ThemeProvider } from '@material-ui/core';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import GlobalStyles from 'src/components/GlobalStyles';
import ScrollReset from 'src/components/ScrollReset';
import CookiesNotification from 'src/components/CookiesNotification';
import GoogleAnalytics from 'src/components/GoogleAnalytics';
import SettingsNotification from 'src/components/SettingsNotification';
import { AuthProvider } from 'src/contextapi/contexts/AuthContextPROD';
import useSettings from 'src/contextapi/hooks/useSettings';
import { createTheme } from 'src/theme';
import routes, { renderRoutes } from 'src/routes';

import { useDispatch } from 'src/store';
import useAuth from 'src/contextapi/hooks/useAuth';
import { ToastContainer, toast } from 'react-toastify';




const jss = create({ plugins: [ ...jssPreset().plugins, rtl() ] });
const history = createBrowserHistory();

const App = () => {
	const { settings } = useSettings();


	const theme = createTheme({
		direction: settings.direction,
		responsiveFontSizes: settings.responsiveFontSizes,
		theme: settings.theme
	});

	
	return (
		<ThemeProvider theme={theme}>
			<StylesProvider jss={jss}>
				<MuiPickersUtilsProvider utils={MomentUtils}>

					<ToastContainer position="top-right"/>
					<SnackbarProvider dense maxSnack={3}>
						<Router history={history}>
							<AuthProvider>
								<GlobalStyles />
								<ScrollReset />
								<GoogleAnalytics />
								{/* <CookiesNotification />
								<SettingsNotification /> */}
								{renderRoutes(routes)}
							</AuthProvider>
						</Router>
					</SnackbarProvider>
				</MuiPickersUtilsProvider>
			</StylesProvider>
		</ThemeProvider>
	);
};

export default App;
