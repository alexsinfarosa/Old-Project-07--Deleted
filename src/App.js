import React from "react";
import { withStyles } from "material-ui/styles";
import withRoot from "./withRoot";

import Drawer from "material-ui/Drawer";
import AppBar from "material-ui/AppBar";
import Toolbar from "material-ui/Toolbar";
import Typography from "material-ui/Typography";
import IconButton from "material-ui/IconButton";
import Hidden from "material-ui/Hidden";
import MenuIcon from "material-ui-icons/Menu";

// components
import LeftPanel from "./components/LeftPanel";

// fetch
import fetchData, { fetchAllStations } from "./fetchData";

// utils
import { michiganIdAdjustment, networkTemperatureAdjustment } from "./utils";

const drawerWidth = 250;
const styles = theme => ({
  root: {
    flexGrow: 1,
    zIndex: 1,
    overflow: "hidden",
    position: "relative",
    display: "flex",
    width: "100%",
    height: "100vh"
  },
  appBar: {
    position: "absolute",
    marginLeft: drawerWidth,
    [theme.breakpoints.up("md")]: {
      width: `calc(100% - ${drawerWidth}px)`
    }
  },
  navIconHide: {
    [theme.breakpoints.up("md")]: {
      display: "none"
    }
  },
  drawerPaper: {
    width: drawerWidth,
    [theme.breakpoints.up("md")]: {
      position: "relative"
    }
  },
  content: {
    flexGrow: 1,
    backgroundColor: "#fff",
    padding: theme.spacing.unit * 3
  },
  link: {
    color: "#fff",
    textDecoration: "none"
  }
});

class App extends React.Component {
  state = {
    isLoading: false,
    mobileOpen: false,
    stations: [],
    data: []
  };

  loadData = async params => {
    const { station, sdate, edate } = params;
    // build params
    let p = {};
    p.sid = `${michiganIdAdjustment(station)} ${station.network}`;
    p.sdate = sdate;
    p.edate = edate;
    p.meta = "tzo";
    p.elems = networkTemperatureAdjustment(station.network);

    // fetching data
    const acisData = await fetchData(p).then(res => res);
    console.log(acisData);

    // clean and replacements
  };

  componentDidMount() {
    this.setState({ isLoading: true });
    fetchAllStations().then(res =>
      this.setState({ stations: res, isLoading: false })
    );
  }

  handleDrawerToggle = () => {
    this.setState({ mobileOpen: !this.state.mobileOpen });
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={this.handleDrawerToggle}
              className={classes.navIconHide}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="title" color="inherit" noWrap>
              Cranberry Fruitworm Model
            </Typography>
            <Typography variant="subheading" style={{ marginLeft: "auto" }}>
              <a
                href="http://newa.cornell.edu/"
                className={classes.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                NEWA
              </a>
            </Typography>
          </Toolbar>
        </AppBar>

        <Hidden mdUp>
          <Drawer
            variant="temporary"
            anchor="left"
            open={this.state.mobileOpen}
            onClose={this.handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper
            }}
            ModalProps={{
              keepMounted: true // Better open performance on mobile.
            }}
          >
            <LeftPanel
              stations={this.state.stations}
              loadData={this.loadData}
            />
          </Drawer>
        </Hidden>

        <Hidden smDown implementation="css">
          <Drawer
            variant="permanent"
            open
            classes={{
              paper: classes.drawerPaper
            }}
          >
            <LeftPanel
              stations={this.state.stations}
              loadData={this.loadData}
            />
          </Drawer>
        </Hidden>

        <main className={classes.content}>
          <Typography noWrap>
            {"You think water moves fast? You should see ice."}
          </Typography>
        </main>
      </div>
    );
  }
}

export default withRoot(withStyles(styles)(App));
