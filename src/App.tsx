import React from "react";
import {
  createMuiTheme,
  CssBaseline,
  makeStyles,
  MuiThemeProvider,
  Typography,
} from "@material-ui/core";

import { SnackbarProvider } from "notistack";

import CardContainerComponent from "./components/card-container/card-container";

const defaultTheme = createMuiTheme();

const theme = createMuiTheme({
  palette: {
    type: "dark",
  },
  typography: {
    h1: {
      fontSize: 52,
      fontWeight: 300,
      lineHeight: "64px",
      [defaultTheme.breakpoints.down("xs")]: {
        fontSize: 26,
        lineHeight: "32px",
      },
    },
  },
});

const useStyles = makeStyles((theme) => ({
  container: {
    height: "100%",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: theme.spacing(3),
  },
  contentContainer: {
    display: "flex",
    flex: 1,
    width: "100%",
  },
}));

const App = () => {
  const classes = useStyles();

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        maxSnack={1}
      >
        <div className={classes.container}>
          <Typography variant="h1" gutterBottom>
            Elder Scrolls Cards
          </Typography>

          <CardContainerComponent className={classes.contentContainer} />
        </div>
      </SnackbarProvider>
    </MuiThemeProvider>
  );
};

export default App;
