import React, { useRef, useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
	Avatar,
	Box,
	Button,
	IconButton,
	List,
	ListItem,
	ListItemAvatar,
	ListItemText,
	Popover,
	SvgIcon,
	Tooltip,
	Typography,
	makeStyles,
	Badge
} from '@material-ui/core';
import { Bell as BellIcon, MessageCircle as MessageIcon, AlertCircle as AlertIcon } from 'react-feather';
import { useDispatch, useSelector } from 'src/store';
import { getNotifications, setAllNotiRead } from 'src/slices/notification';
import { Fragment } from 'react';
import { CancelPresentation, ClearRounded, FindInPage, NoteAdd, Spellcheck } from '@material-ui/icons';
import { palette } from 'src/theme';

const iconsMap = {
	new_message: MessageIcon,
	default: NoteAdd,
	aprobado: Spellcheck,
	rechazo: ClearRounded

};

const useStyles = makeStyles((theme) => ({
	popover: {
		width: 320
	},
	icon: {
		backgroundColor: theme.palette.secondary.main,
		color: theme.palette.secondary.contrastText
	}
}));

const Notifications = ({ light }) => {
	const classes = useStyles();
	let { notifications } = useSelector((state) => state.notifications);
	const ref = useRef(null);
	const dispatch = useDispatch();
	const [isOpen, setOpen] = useState(false);

	const handleOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	useEffect(
		() => {
			dispatch(getNotifications());
		},
		[dispatch]
	);

	notifications = notifications.filter((noti) => !noti.pivot.read);



	return (
		<Fragment>
			<Tooltip title="Notifications">
				<IconButton color="inherit" ref={ref} onClick={handleOpen}>
					<Badge color="secondary" badgeContent={notifications.length} invisible={notifications.length == 0}>
						<SvgIcon>
							<BellIcon style={{ color: light ? palette.bgs.azn_dark : palette.bgs.light }} />
						</SvgIcon>
					</Badge>
				</IconButton>
			</Tooltip>
			<Popover
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'center'
				}}
				classes={{ paper: classes.popover }}
				anchorEl={ref.current}
				onClose={handleClose}
				open={isOpen}
			>
				<Box p={2}>
					<Typography variant="h5" color="textPrimary">
						Notificaciones
					</Typography>
				</Box>
				{notifications.length === 0 ? (
					<Box p={2}>
						<Typography variant="h6" color="textPrimary">
							No tienes notificaciones nuevas
							<br />
							Ir a la <RouterLink to="/afp/notificaciones">bandeja de notificaciones</RouterLink>
						</Typography>
					</Box>
				) : (
					<Fragment>
						<List disablePadding>
							{notifications.map((notification) => {
								const Icon = iconsMap[notification.tipo];

								return (
									<ListItem
										component={RouterLink}
										divider
										key={notification.id}
										to={`/afp/notificaciones/?noti=${notification.id}`}
									>
										<ListItemAvatar>
											<Avatar className={classes.icon}>
												<SvgIcon fontSize="small">
													<Icon />
												</SvgIcon>
											</Avatar>
										</ListItemAvatar>
										<ListItemText
											primary={notification.titulo}
											primaryTypographyProps={{ variant: 'subtitle2', color: 'textPrimary' }}
											secondary={notification.descripcion}
										/>
									</ListItem>
								);
							})}
						</List>
						<Box p={1} display="flex" justifyContent="center">
							<Button component={Button} size="small" onClick={() => dispatch(setAllNotiRead())}>
								Marcar todo como leído
							</Button>
						</Box>
					</Fragment>
				)}
			</Popover>
		</Fragment>
	);
};

export default Notifications;
