
import React from 'react';
import PropTypes from 'prop-types';
import {
  Button, Typography, AppBar, Toolbar,
} from '@material-ui/core';
import { FormattedMessage, intlShape } from 'react-intl';
import { unstable_useMediaQuery as useMediaQuery } from '@material-ui/core/useMediaQuery';
import { Home, Map } from '@material-ui/icons';
import Sidebar from '../views/Sidebar';
import MapContainer from '../views/Map/MapContainer';
import I18n from '../i18n';
import MobileBottomNavigation from '../components/MobileBottomNavigation/MobileBottomNavigation';
import config from '../../config';
import { generatePath } from '../utils/path';
import HomeLogo from '../components/Logos/HomeLogo';
import { DesktopComponent } from './WrapperComponents/WrapperComponents';
import Settings from '../components/Settings';

// eslint-disable-next-line camelcase
const mobileBreakpoint = config.mobile_ui_breakpoint;
const smallScreenBreakpoint = config.small_screen_breakpoint;

const createContentStyles = (
  isMobile, isSmallScreen, landscape, mobileMapOnly, keyboardVisible,
) => {
  let width = 450;
  if (isMobile) {
    width = '100%';
  } else if (isSmallScreen) {
    width = '50%';
  }
  const bottomBarHeight = 64;

  const styles = {
    activeRoot: {
      flexDirection: mobileMapOnly || isMobile ? 'column' : 'row',
      margin: 0,
      width: '100%',
      display: 'flex',
      flexWrap: 'nowrap',
      height: isMobile ? '100%' : 'calc(100vh - 64px)',
    },
    sidebar: {
      top: 0,
      bottom: 0,
      width,
      margin: 0,
      overflow: 'auto',
      paddingBottom: isMobile && !mobileMapOnly ? bottomBarHeight : 0,
    },
    logo: {
      marginLeft: 8,
    },
    map: {
      position: isMobile ? 'fixed' : null,
      bottom: 0,
      margin: 0,
      flex: !isMobile || mobileMapOnly ? 1 : 0,
      display: isMobile && !mobileMapOnly ? 'none' : 'flex',
      height: '100%',
      width: '100%',
      paddingBottom: isMobile && !keyboardVisible ? bottomBarHeight : 0,
    },
    mobileNav: {
      position: 'fixed',
      height: bottomBarHeight,
      bottom: keyboardVisible ? -100 : 0,
      zIndex: 999999999,
      backgroundColor: '#2242C7',
    },
    topNavLeft: {
      display: 'flex',
      height: 64,
      minWidth: width,
      justifyContent: 'space-between',
    },
    topNavRight: {
      flex: '1 1 auto',
    },
    toolbar: {
      padding: 0,
    },
  };

  // Mobile map view styles
  if (mobileMapOnly) {
    styles.sidebar.visibility = 'hidden';
  } else if (isMobile) {
    styles.sidebar.flex = '1 1 auto';
  }

  // Landscape orientation styles
  if (landscape && isMobile) {
    styles.map.paddingBottom = '10vw';
    styles.mobileNav.height = '10vw';
  }


  return styles;
};

const DefaultLayout = (props) => {
  const {
    i18n, intl, location, match, navigator,
  } = props;
  const { params } = match;
  const lng = params && params.lng;
  const isMobile = useMediaQuery(`(max-width:${mobileBreakpoint}px)`);
  const isSmallScreen = useMediaQuery(`(max-width:${smallScreenBreakpoint}px)`);
  const mobileMapOnly = isMobile && location.pathname.indexOf('/map') > -1; // If mobile map view
  const landscape = useMediaQuery('(min-device-aspect-ratio: 1/1)');
  const portrait = useMediaQuery('(max-device-aspect-ratio: 1/1)');
  // This checks if the keyboard is up.
  // Works on all tested mobile devices but should be replaced in the future.
  const keyboardVisible = (landscape ? useMediaQuery('(max-height:200px)') : useMediaQuery('(max-height:500px)'));

  const styles = createContentStyles(
    isMobile, isSmallScreen, landscape, mobileMapOnly, keyboardVisible,
  );

  return (
    <>
      {
        !isMobile
        && (
        <AppBar position="relative" style={{ height: 64 }}>
          <Toolbar style={styles.toolbar}>
            <div
              style={styles.topNavLeft}
            >
              <div style={{ flex: '1 0 auto', display: 'flex' }}>
                {
                    // Jump link to main content for screenreaders
                    // Must be first interactable element on page
                  }
                <a id="site-title" href="#view-title" className="sr-only">
                  <Typography variant="srOnly">
                    <FormattedMessage id="general.skipToContent" />
                  </Typography>
                </a>
                {
                    // Home logo link to home view
                  }
                <a href={generatePath('home', lng)} style={{ alignSelf: 'center' }} className="focus-dark-background">
                  <HomeLogo aria-hidden="true" style={styles.logo} />
                  <Typography className="sr-only" color="inherit" component="h1" variant="body1">
                    <FormattedMessage id="app.title" />
                  </Typography>
                </a>
              </div>
              <div style={{ flex: '0 0 auto', display: 'flex' }}>
                {
                  i18n.availableLocales
                    .filter(locale => locale !== i18n.locale)
                    .map(locale => (
                      <Button
                        className="focus-dark-background"
                        role="link"
                        key={locale}
                        color="inherit"
                        variant="text"
                        onClick={() => {
                          const newLocation = location;
                          const newPath = location.pathname.replace(/^\/[a-zA-Z]{2}\//, `/${locale}/`);
                          newLocation.pathname = newPath;
                          window.location = `${newLocation.pathname}${newLocation.search}`;
                        }}
                      >
                        <Typography color="inherit" variant="body2" style={{ textTransform: 'none' }}>
                          {i18n.localeText(locale)}
                        </Typography>
                      </Button>
                    ))
                }
                <Settings />
              </div>


            </div>
            <div style={styles.topNavRight}>
              <a href="https://forms.gle/roe9XNrZGQWBhMBJ7" rel="noopener noreferrer" target="_blank" style={{ display: 'inline-block' }}>
                <p style={{ margin: 0, color: 'white', textDecorationColor: 'white' }}>
                  <FormattedMessage id="general.give.feedback" />
                </p>
              </a>
            </div>
          </Toolbar>
        </AppBar>
        )
      }
      <div style={styles.activeRoot}>
        <div className="SidebarWrapper" style={styles.sidebar}>
          <main style={{ height: '100%' }}>
            <Sidebar />
          </main>
        </div>
        <div style={styles.map}>
          <MapContainer isMobile={!!isMobile} />
        </div>
        <MobileBottomNavigation
          style={styles.mobileNav}
          actions={[
            {
              label: intl.formatMessage({ id: 'general.home' }),
              onClick: () => {
                if (navigator) {
                  navigator.push('home');
                }
              },
              icon: <Home />,
              path: 'home',
            },
            {
              label: intl.formatMessage({ id: 'map' }),
              onClick: () => {
                if (navigator) {
                  navigator.push('map');
                }
              },
              icon: <Map />,
              path: 'map',
            },
          /*
            {
              label: 'Settings',
              onClick: () => {
                if (history) {
                  // TODO: Add query text once functionality is ready for search view
                  // history.push('/fi/map/');
                }
              },
              icon: <Settings />,
              path: 'settings',
            },
            */
          ]}
        />
      </div>
      <footer role="contentinfo" className="sr-only">
        <DesktopComponent>
          <a href="#site-title">
            <FormattedMessage id="general.backToStart" />
          </a>
        </DesktopComponent>
      </footer>
    </>
  );
};

// Typechecking
DefaultLayout.propTypes = {
  intl: intlShape.isRequired,
  i18n: PropTypes.instanceOf(I18n),
  location: PropTypes.objectOf(PropTypes.any).isRequired,
  match: PropTypes.objectOf(PropTypes.any).isRequired,
  navigator: PropTypes.objectOf(PropTypes.any),
};

DefaultLayout.defaultProps = {
  i18n: null,
  navigator: null,
};

export default DefaultLayout;
