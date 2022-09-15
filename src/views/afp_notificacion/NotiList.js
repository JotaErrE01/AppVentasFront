import React, { useEffect, useState, Fragment } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'src/store';
import { AlertCircle } from 'react-feather';
import { CancelPresentation, FindInPage, NoteAdd, Spellcheck,ClearRounded } from '@material-ui/icons';

import {
	makeStyles,
	Typography,
	Accordion,
	AccordionSummary,
	AccordionDetails,
	CircularProgress,
	Box,
	ListItem,
	ListItemIcon,
	SvgIcon,
	ListItemText,
	Grid,
	Button,
	Badge
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useSnackbar } from 'notistack';
import {
	MessageCircle as MessageIcon,
	AlertCircle as AlertIcon
} from 'react-feather';


const iconsMap = {
	new_message: MessageIcon,
	default: NoteAdd,
	aprobado: Spellcheck,
	rechazo: ClearRounded
};

const NotiList = ({ loading, notificaciones, selected, onRead, onAllRead }) => {
	const [ indexExpand, setIndexExpand ] = useState();

	const { enqueueSnackbar } = useSnackbar();
	const dispatch = useDispatch();

	const classes = useStyles();

	useEffect(
		() => {
			if (selected) {
				let index = notificaciones.findIndex((noti) => noti.id == selected);
				setIndexExpand(index);
			}
		},
		[ notificaciones, selected ]
	);

	if (loading)
		return (
			<Box textAlign="center" m="3">
				<CircularProgress />
			</Box>
		);

	const handleExpand = (noti, index) => {
		indexExpand == index ? setIndexExpand() : setIndexExpand(index);

		if (!noti.pivot.read) {
			onRead(noti);
		}
	};

	return (
		<Fragment>
			{notificaciones.length == 0 ? (
				<Box textAlign="center" m="3">
					<Typography className={classes.heading}>No tienes nuevas notificaciones</Typography>
				</Box>
			) : (
				<Fragment>
					<Box pb="2">
						<Grid container direction="row-reverse" spacing={1}>
							<Grid item>
								<Button size="small" onClick={() => onAllRead()}>
									Marcar todo como leído
								</Button>
							</Grid>
						</Grid>
					</Box>
					{notificaciones.map((noti, index) => {
						const Icon = iconsMap[noti.tipo];

						return (
							<Accordion expanded={indexExpand === index} onChange={() => handleExpand(noti, index)}>
								<AccordionSummary
									expandIcon={<ExpandMoreIcon />}
									aria-controls={`panel1bh-content-${index}`}
									id={`panel1bh-header-${index}`}
								>
									<ListItem>
										<ListItemIcon>
											<Badge color="primary" variant="dot" invisible={noti.pivot.read}>
												<SvgIcon fontSize="small">
													<Icon />
												</SvgIcon>
											</Badge>
										</ListItemIcon>
										<ListItemText
											primary={<Typography className={classes.heading}>{noti.titulo}</Typography>}
											secondary={
												noti.oportunidad_id && (
													<Typography className={classes.secondaryHeading}>
														Ir a oportunidad {' '}
														<RouterLink
															to={`/afp/crm/oportunidad/mantenimientoOportunidad/${noti.oportunidad_id}`}
														>
															#{noti.oportunidad_id}
														</RouterLink>
													</Typography>
												)
											}
										/>
									</ListItem>
								</AccordionSummary>
								<AccordionDetails>
									<Typography>{noti.descripcion_larga}</Typography>
								</AccordionDetails>
							</Accordion>
						);
					})}
				</Fragment>
			)}
		</Fragment>
	);
};

const useStyles = makeStyles((theme) => ({
	root: {
		width: '100%'
	},
	heading: {
		fontSize: theme.typography.pxToRem(15),
		flexBasis: '33.33%',
		flexShrink: 0
	},
	secondaryHeading: {
		fontSize: theme.typography.pxToRem(15),
		color: theme.palette.text.secondary
	}
}));

export default NotiList;
