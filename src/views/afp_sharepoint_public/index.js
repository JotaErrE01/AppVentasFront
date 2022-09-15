import React, { useState, useEffect } from 'react';
import baseurl from 'src/config/baseurl';
import LoginLayout from './view/LoginLayout';
import axs from 'src/utils/axs';
import JSONTree from 'react-json-tree';
import { Box, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, Typography } from '@material-ui/core';
import { Paperclip } from 'react-feather';
import { BluetoothDisabledOutlined } from '@material-ui/icons';
import { blobToUrl, urlDownload } from 'src/utils/filehelpers';
import LoadSpinner from 'src/components/LoadSpinner';
import LoadBounce from 'src/components/common/LoadBounce';
import { useParams } from 'react-router';

const SharepointPublic = () => {
	const [ files, setFiles ] = useState([]);
	const params = useParams();

	useEffect(() => {
		async function fetchMyAPI() {

			let tipo_fondo = '';
			if (params.tipo_fondo == '000001') {
				tipo_fondo = 'FLP';
			} else {
				tipo_fondo = 'FCP';
			}

			const query = '/afp/crm/rol_has_sharepoint_file/categoria/2/' + tipo_fondo;
			let response = await axs(`${baseurl}${query}`);
			response = response && response.data;

			if (response && response.data && response.data.sharepointFiles) {
				const payload = response.data.sharepointFiles.map((item) => ({
					description: item.description,
					blob_file: item.share_point_file.blob_file
				}));
				setFiles(payload);
				
			}
		}

		fetchMyAPI();
	}, []);

	const handleShare = async (file, description) => {
		const name = description;
		const fileURL = blobToUrl(file);
		urlDownload(fileURL, name);
	};

	let p2 = 'Adjuntamos las guías de tu fondo:';

	if(params.tipo_fondo == '000001') {
		p2 = 'Adjuntamos las guías de tu Fondo Horizonte, donde podrás revisar las condiciones completas de tus beneficios adicionales al fondo:'
	}

	return (
		<LoginLayout tipoFondo={params.tipo_fondo}>
			<Typography variant="h1">Gracias por ser parte de nosotros</Typography>
			<Box m={3}>
				<Typography variant="h5">{p2}</Typography>
			</Box>

			<List style={{ width: '80%' }}>
				{files.map((file) => (
					<ListItem style={{ marginBottom: '.9em' }}>
						<ListItemText primary={file.description} />
						<ListItemSecondaryAction>
							<IconButton onClick={() => handleShare(file.blob_file, file.description)}>
								<Paperclip />
							</IconButton>
						</ListItemSecondaryAction>
					</ListItem>
				))}
			</List>
		</LoginLayout>
	);
};

export default SharepointPublic;
