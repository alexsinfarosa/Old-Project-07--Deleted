import React, { Fragment } from "react";
import { withStyles } from "material-ui/styles";
import withRoot from "./withRoot";

import Drawer from "material-ui/Drawer";
import AppBar from "material-ui/AppBar";
import Toolbar from "material-ui/Toolbar";
import Typography from "material-ui/Typography";
import IconButton from "material-ui/IconButton";
import Hidden from "material-ui/Hidden";
import MenuIcon from "material-ui-icons/Menu";
import Modal from "material-ui/Modal";

// components
import LeftPanel from "./components/LeftPanel";
// import TopControls from "./components/TopControls";
import GDDTable from "./components/GDDTable";
import USMap from "./components/USMap";

// fetch
import fetchData, { fetchAllStations } from "./fetchData";
import cleanFetchedData from "./cleanFetchedData";
import transformData from "./transformData";

// utils
import { michiganIdAdjustment, networkTemperatureAdjustment } from "./utils";

// date-fns
import { format, startOfYear } from "date-fns";

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
    flexShrink: 1,
    // backgroundColor: "#fff",
    paddingLeft: theme.spacing.unit * 1.5,
    paddingRight: theme.spacing.unit * 1.5,
    paddingTop: theme.spacing.unit * 8,
    maxWidth: 1200,
    margin: "0 auto"
  },
  link: {
    color: "#fff",
    textDecoration: "none"
  },
  modal: {
    width: "100%",
    height: "50vh"
  }
});

class App extends React.Component {
  state = {
    isLoading: false,
    mobileOpen: false,
    stations: [],
    data: [],
    params: {},
    isModalOpen: false
  };

  loadData = async params => {
    // console.log(params);
    this.setState({ params, isLoading: true });
    const { station, edate, bioFix } = params;
    // build params
    let p = {};
    p.sid = `${michiganIdAdjustment(station)} ${station.network}`;
    p.sdate = format(startOfYear(edate), "YYYY-MM-DD");
    p.edate = format(edate, "YYYY-MM-DD");
    p.bioFix = bioFix ? format(bioFix, "YYYY-MM-DD") : null;
    p.meta = "tzo";
    p.elems = networkTemperatureAdjustment(station.network);

    console.log(p);
    // fetching data
    const acisData = await fetchData(p).then(res => res);

    // clean and replacements
    const cleanedData = await cleanFetchedData(acisData, p.edate);

    // transform data
    const transformedData = await transformData(cleanedData, p.bioFix);

    this.setState({ data: transformedData, isLoading: false });
  };

  componentDidMount() {
    fetchAllStations().then(res =>
      this.setState({ stations: res, isLoading: false })
    );
  }

  componentDidUpdate() {
    localStorage.setItem(
      "newa-cranberry-fruitworm-model",
      JSON.stringify(this.state.params)
    );
  }

  handleDrawerToggle = () => {
    this.setState({ mobileOpen: !this.state.mobileOpen });
  };

  closeDrawer = () => {
    this.setState({ mobileOpen: false });
  };

  toggleModal = () => {
    this.setState({ isModalOpen: !this.state.isModalOpen });
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
              closeDrawer={this.closeDrawer}
              toggleModal={this.toggleModal}
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
              closeDrawer={this.closeDrawer}
              toggleModal={this.toggleModal}
            />
          </Drawer>
        </Hidden>

        <main className={classes.content}>
          {this.state.data.length !== 0 && (
            <Fragment>
              <GDDTable
                data={this.state.data}
                isLoading={this.state.isLoading}
                bioFix={this.state.params.bioFix}
              />
            </Fragment>
          )}
        </main>

        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.state.isModalOpen}
          onClose={this.toggleModal}
        >
          <div className={classes.modal}>
            <USMap params={this.state.params} stations={this.state.stations} />
          </div>
        </Modal>
      </div>
    );
  }
}

export default withRoot(withStyles(styles)(App));
