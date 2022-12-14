import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Breadcrumbs,
  Container,
  Grid,
  Link,
  Typography,
  makeStyles
} from '@material-ui/core';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import Page from 'src/components/Page';
import AudioRoomTest from './AudioRoomTest';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  }
}));

function AudioRoomTestView() {
  const classes = useStyles();

  return (
    <Page
      className={classes.root}
      title="Echo Test"
    >
      <Container maxWidth="lg">
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
        >
          <Link
            variant="body1"
            color="inherit"
            to="/app"
            component={RouterLink}
          >
            Dashboard
          </Link>
          <Typography
            variant="body1"
            color="textPrimary"
          >
            Janus Gategay
          </Typography>
        </Breadcrumbs>
        <Typography
          variant="h3"
          color="textPrimary"
        >
          Video Room Test
        </Typography>
        <Box mt={3}>
          <Grid container>
            <Grid
              item
              xs={12}
              md={6}
            >
              <AudioRoomTest />
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Page>
  );
}

export default AudioRoomTestView;