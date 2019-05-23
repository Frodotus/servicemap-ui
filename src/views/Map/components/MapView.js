/* eslint-disable global-require */
import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { renderToStaticMarkup } from 'react-dom/server';
import { withStyles } from '@material-ui/core';
import TransitStopInfo from './TransitStopInfo';
import { drawMarkerIcon } from '../utils/drawIcon';

const transitIconSize = 30;

class MapView extends React.Component {
  constructor(props) {
    super(props);
    this.mapRef = React.createRef();
    this.state = {
      Map: undefined,
      TileLayer: undefined,
      ZoomControl: undefined,
      Marker: undefined,
      Popup: undefined,
      Polygon: undefined,
      highlightedDistrict: null,
      refSaved: false,
    };
  }

  componentDidMount() {
    this.initiateLeaflet();
  }

  componentDidUpdate() {
    this.saveMapReference();
  }

  getTransitIcon = (type) => {
    const { divIcon } = require('leaflet');
    const { classes } = this.props;
    let className = null;
    let id = null;

    switch (type) {
      case 3: // Bus stops
        className = 'busIcon';
        id = 2;
        break;
      case 0: // Tram stops
        className = 'tramIcon';
        id = 3;
        break;
      case 109: // Train stops
        className = 'trainIcon';
        id = 4;
        break;
      case 1: // Subway stops
        className = 'metroIcon';
        id = 5;
        break;
      case -999: // Ferry stops
        className = 'ferryIcon';
        id = 6;
        break;
      default:
        className = 'busIcon';
        id = 2;
        break;
    }
    return divIcon({
      html: renderToStaticMarkup(
        <>
          <span className={classes.transitBackground}>&nbsp;</span>
          <span className={classes[className]}>{id}</span>
        </>,
      ),
      iconSize: [transitIconSize * 1.2, transitIconSize * 1.2],
    });
  }

  getMapRefElement() {
    return this.mapRef.current.leafletElement;
  }

  saveMapReference() {
    const { saveMapRef } = this.props;
    const { refSaved } = this.state;
    if (this.mapRef.current && !refSaved) {
      this.setState({ refSaved: true });
      saveMapRef(this.mapRef.current);
    }
  }

  // Check if transit stops should be shown
  showTransitStops() {
    const { mapType, mobile } = this.props;
    const transitZoom = mobile ? mapType.options.mobileTransitZoom : mapType.options.transitZoom;
    const mapRefElement = this.getMapRefElement();
    const currentZoom = mapRefElement.getZoom();
    return currentZoom >= transitZoom;
  }

  initiateLeaflet() {
    // The leaflet map works only client-side so it needs to be imported here
    const leaflet = require('react-leaflet');

    const {
      Map, TileLayer, ZoomControl, Marker, Popup, Polygon,
    } = leaflet;

    this.setState({
      Map, TileLayer, ZoomControl, Marker, Popup, Polygon,
    });
  }

  render() {
    const {
      mapType,
      unitList,
      mapOptions,
      // districtList,
      style,
      fetchTransitStops,
      clearTransitStops,
      navigator,
      transitStops,
      getLocaleText,
      mobile,
    } = this.props;
    const {
      Map, TileLayer, ZoomControl, Marker, Popup, Polygon, highlightedDistrict,
    } = this.state;

    const unitListFiltered = unitList.filter(unit => unit.object_type === 'unit');
    const zoomLevel = mobile ? mapType.options.mobileZoom : mapType.options.zoom;

    if (Map) {
      return (
        <Map
          ref={this.mapRef}
          keyboard={false}
          style={style}
          zoomControl={false}
          crs={mapType.crs}
          center={mapOptions.initialPosition}
          zoom={zoomLevel}
          minZoom={mapType.options.minZoom}
          maxZoom={mapType.options.maxZoom}
          maxBounds={mapOptions.maxBounds}
          onMoveEnd={() => {
            if (this.showTransitStops()) {
              fetchTransitStops(this.getMapRefElement());
            } else if (transitStops.length > 0) {
              clearTransitStops();
            }
          }}
        >
          <TileLayer
            url={mapType.options.url}
            attribution='&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors'
          />
          {unitListFiltered.map((unit) => {
            // Show markers with location
            if (unit && unit.location) {
              return (
                <Marker
                  className="unitMarker"
                  key={unit.id}
                  position={[unit.location.coordinates[1], unit.location.coordinates[0]]}
                  icon={drawMarkerIcon(unit, mapType.options.name)}
                  onClick={() => {
                    if (navigator) {
                      navigator.push('unit', unit.id);
                    }
                  }}
                  keyboard={false}
                />
              );
            } return null;
          })}
          {highlightedDistrict ? (
            <Polygon
              positions={[
                [mapOptions.polygonBounds],
                [highlightedDistrict.boundary.coordinates[0]],
              ]}
              color="#ff8400"
              fillColor="#000"
            />
          ) : null}
          {highlightedDistrict && highlightedDistrict.unit ? (
            <Marker
              position={[
                highlightedDistrict.unit.location.coordinates[1],
                highlightedDistrict.unit.location.coordinates[0],
              ]}
              icon={drawMarkerIcon(highlightedDistrict.unit, mapType.options.name)}
              keyboard={false}
            >
              <Popup autoPan={false}>
                <p>{getLocaleText(highlightedDistrict.unit.name)}</p>
              </Popup>
            </Marker>
          ) : null}
          {
            transitStops.map((stop) => {
              // Draw transit markers if zoom is within allowed limits
              if (this.showTransitStops()) {
                return (
                  <Marker
                    icon={this.getTransitIcon(stop.vehicleType)}
                    key={stop.name + stop.gtfsId}
                    position={[stop.lat, stop.lon]}
                    keyboard={false}
                  >
                    <Popup autoPan={false}>
                      <TransitStopInfo stop={stop} />
                    </Popup>
                  </Marker>
                );
              }
              return null;
            })
        }
          <ZoomControl position="bottomright" aria-hidden="true" />
        </Map>
      );
    }
    return <p>No map</p>;
  }
}

const styles = ({
  transitBackground: {
    zIndex: -1,
    width: '67%',
    height: '67%',
    backgroundColor: 'white',
    position: 'absolute',
    top: '51%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    border: 'white',
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: '14%',
  },
  busIcon: {
    fontFamily: 'hsl-piktoframe',
    color: '#007AC9',
    fontSize: transitIconSize,
    lineHeight: '125%',
  },
  tramIcon: {
    fontFamily: 'hsl-piktoframe',
    color: '#00985F',
    fontSize: transitIconSize,
    lineHeight: '125%',
  },
  trainIcon: {
    fontFamily: 'hsl-piktoframe',
    color: '#8C4799',
    fontSize: transitIconSize,
    lineHeight: '125%',
  },
  metroIcon: {
    fontFamily: 'hsl-piktoframe',
    color: '#FF6319',
    fontSize: transitIconSize,
    lineHeight: '125%',
  },
  ferryIcon: {
    fontFamily: 'hsl-piktoframe',
    color: '#00B9E4',
    fontSize: transitIconSize,
    lineHeight: '125%',
  },
});

export default withRouter(withStyles(styles)(MapView));

// Typechecking
MapView.propTypes = {
  style: PropTypes.objectOf(PropTypes.any),
  mapType: PropTypes.objectOf(PropTypes.any),
  unitList: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.object, PropTypes.array])),
  // districtList: PropTypes.arrayOf(PropTypes.object),
  mapOptions: PropTypes.objectOf(PropTypes.any),
  fetchTransitStops: PropTypes.func,
  navigator: PropTypes.objectOf(PropTypes.any),
  clearTransitStops: PropTypes.func,
  transitStops: PropTypes.arrayOf(PropTypes.object),
  getLocaleText: PropTypes.func.isRequired,
  saveMapRef: PropTypes.func.isRequired,
  mobile: PropTypes.bool,
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
};

MapView.defaultProps = {
  style: { width: '100%', height: '100%' },
  mapType: {},
  mapOptions: {},
  navigator: null,
  unitList: [],
  // districtList: [],
  fetchTransitStops: null,
  clearTransitStops: null,
  transitStops: [],
  mobile: false,
};
