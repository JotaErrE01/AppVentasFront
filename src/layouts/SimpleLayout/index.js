import { Grid, CardHeader, makeStyles } from '@material-ui/core'
import { IconButton } from '@material-ui/core'
import { CloseOutlined, MenuOutlined } from '@material-ui/icons'
import React, { useEffect, useState } from 'react'
import { palette } from 'src/theme'
import RoomListCore from 'src/views/afp_core_rooms/RoomsList/RoomListCore'
import styled from 'styled-components'
import Logo from './Logo'
import IndexLateral from './IndexLateral'
import User from './User'
import PerfectScrollbar from 'react-perfect-scrollbar';
import DebugDialog from 'src/components/common/DebugDialog'
import useAuth from 'src/contextapi/hooks/useAuth'
import Notifications from '../DashboardLayout/TopBar/Notifications'
import SearchBar from './SearchBar'
import { useDispatch, useSelector } from 'src/store'
import JSONTree from 'react-json-tree'
import { useSnackbar } from 'notistack'
import { getServerinfo } from 'src/slices/serverInfo'


export default function SimpleLayout({ children }) {

    const classes = useStyles();
    const [open, setOpen] = useState(true);
    const { user } = useAuth();


    //rdx
    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useDispatch();
    const {serverinfo, loading } = useSelector(state => state.serverinfo);

    useEffect(() => {
        dispatch(getServerinfo(enqueueSnackbar));
    }, [])

    return (

        <>

            <TopBar hidden={false} >
                <Grid container direction="row" className={classes.flexView}>
                    <Grid className={classes.start}>
                        <IconButton onClick={() => setOpen(open ? 0 : 21)} style={{ color: palette.primary.contrastText }}>
                            <MenuOutlined />
                        </IconButton>
                        <Logo size="xs" />
                    </Grid>
                    <Grid className={classes.end}>
                        <Notifications />
                        <SearchBar />
                        <User />
                    </Grid>
                </Grid>
            </TopBar>

            {/* MENU LATERAL */}
            <View>
                <MenuSide>
                    <PerfectScrollbar options={{ suppressScrollX: true }}>
                        <IndexLateral />
                        {/* <RoomListCore /> */}
                        <DebugDialog data={{...serverinfo, user}}/>

                    </PerfectScrollbar>
                </MenuSide>
                <Main open={open}>
                    {/* <PerfectScrollbar options={{ suppressScrollX: true }}> */}
                        {children}
                    {/* </PerfectScrollbar> */}
                </Main>
            </View>


        </>
    )
}



const TopBar = styled.div`
  top:0;
  left: 0;
  z-index: 3;
  justify-content: space-between;
  background-color: ${palette.primary.main};
  padding:.6em;

`


const View = styled.div`
    height: 100vh;
    /* width: 100vw; */
    display: flex;
    overflow: hidden;
`


const MenuSide = styled.div`
    border-right: 3px solid #f2f6fc;
    overflow: hidden;
    width:21em;
`


const Main = styled.div`
     /* 
    overflow: hidden;
    z-index: 3; */
    will-change: transform;
    transition: .3s ease;
    transform: translateX( ${props => props.open ? "0" : -"calc(100vw - 21em)"} );
    min-width: ${props => props.open ? "calc(100vw - 21em)" : "100%"};
    overflow:scroll;
    margin-bottom:3em;
`

const useStyles = makeStyles((theme) => ({
    flexView: {
        display: 'flex',
        justifyContent: 'space-between',
    },
    start: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'start',
        flex: 3,
        gap: "1em"
    },
    mid: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        flex: 6,
    },
    end: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'end',
        gap: '1em',
        flex: 3,
    },

}));
