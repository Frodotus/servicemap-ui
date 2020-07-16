import React from 'react';
import PropTypes from 'prop-types';
import { Typography, Paper } from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import { config } from './EmbedderView';

const IFramePreview = ({
  classes,
  customWidth,
  embedUrl,
  fixedHeight,
  heightMode,
  ratioHeight,
  widthMode,
}) => {
  if (!embedUrl) {
    return null;
  }
  const wrapperStyleObject = () => ({
    position: 'relative',
    width: '100%',
    paddingBottom: `${ratioHeight}%`,
  });
  const iframeConfig = config.DEFAULT_IFRAME_PROPERTIES || {};
  const hasContainer = heightMode === 'ratio' && widthMode === 'auto';

  let height = '100%';
  let width = '100%';
  let widthUnit = 'px';
  if (heightMode === 'fixed') { height = fixedHeight; }
  if (heightMode === 'ratio') {
    if (widthMode !== 'auto') {
      height = parseInt(parseInt(customWidth, 10) * (parseInt(ratioHeight, 10) / 100.0), 10);
    }
  }

  if (!hasContainer && height) {
    width = widthMode !== 'custom' ? (
      iframeConfig.style && iframeConfig.style.width && iframeConfig.style.width
    ) : customWidth;
    widthUnit = width !== '100%' ? 'px' : '';
  }

  const styles = {
    position: hasContainer ? 'absolute' : null,
    top: hasContainer ? 0 : null,
    left: hasContainer ? 0 : null,
    border: 'none',
    width: hasContainer ? '100%' : `${width}${widthUnit}`,
    height: hasContainer ? '100%' : `${height}px`,
  };
  const element = hasContainer ? (
    <div style={wrapperStyleObject()}>
      <iframe
        title="Upotus"
        style={styles}
        src={embedUrl}
      />
    </div>
  ) : (
    <iframe
      title="Upotus"
      style={styles}
      src={embedUrl}
    />
  );

  return (
    <Paper className={classes.formContainerPaper}>
      <Typography
        align="left"
        className={classes.marginBottom}
        variant="h5"
      >
        <FormattedMessage id="embedder.preview.title" />
      </Typography>
      <div className={classes.iframeContainer} style={{ width: '100%' }}>
        <div className={classes.iframeWrapper}>
          {
            element
          }
        </div>
      </div>
    </Paper>
  );
};

IFramePreview.propTypes = {
  classes: PropTypes.shape({
    formContainerPaper: PropTypes.string,
    iframeContainer: PropTypes.string,
    iframeWrapper: PropTypes.string,
    marginBottom: PropTypes.string,
  }).isRequired,
  customWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  embedUrl: PropTypes.string.isRequired,
  fixedHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  heightMode: PropTypes.string.isRequired,
  ratioHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  widthMode: PropTypes.string.isRequired,
};

IFramePreview.defaultProps = {
  customWidth: null,
  fixedHeight: null,
  ratioHeight: null,
};

export default IFramePreview;
