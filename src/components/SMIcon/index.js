import React from 'react';
import SMIcon from './SMIcon';
import defaulMapIcon from '../../assets/images/iconDefaultMap.svg';
import aerialMapIcon from '../../assets/images/iconAerialMap.svg';
import guideMapIcon from '../../assets/images/iconGuideMap.svg';

/**
 * Senses
 */
export const HearingIcon = ({ ...rest }) => (
  <SMIcon icon="icon-icon-hearing-aid" {...rest} />
);

export const ColorblindIcon = ({ ...rest }) => (
  <SMIcon icon="icon-icon-colour-blind" {...rest} />
);

export const VisualImpairmentIcon = ({ ...rest }) => (
  <SMIcon icon="icon-icon-visually-impaired" {...rest} />
);

/**
 * Mobility
 */
export const OnFootIcon = ({ ...rest }) => (
  <SMIcon icon="icon-icon-by-foot" {...rest} />
);

export const ReducedMobilityIcon = ({ ...rest }) => (
  <SMIcon icon="icon-icon-reduced-mobility" {...rest} />
);

export const StrollerIcon = ({ ...rest }) => (
  <SMIcon icon="icon-icon-stroller" {...rest} />
);

export const WheelchairIcon = ({ ...rest }) => (
  <SMIcon icon="icon-icon-wheelchair" {...rest} />
);

export const RollatorIcon = ({ ...rest }) => (
  <SMIcon icon="icon-icon-rollator" {...rest} />
);

/**
 * Map types
 */
export const DefaultMapIcon = ({ ...rest }) => (
  <img aria-hidden alt="" {...rest} src={defaulMapIcon} />
);

export const AerialMapIcon = ({ ...rest }) => (
  <img aria-hidden alt="" {...rest} src={aerialMapIcon} />
);

export const GuideMapIcon = ({ ...rest }) => (
  <img aria-hidden alt="" {...rest} src={guideMapIcon} />
);

/**
 * General
 */
export const AreaIcon = ({ ...rest }) => (
  <SMIcon icon="icon-icon-areas-and-districts" {...rest} />
);
export const AddressIcon = ({ ...rest }) => (
  <SMIcon icon="icon-icon-address" {...rest} />
);

export const MapIcon = ({ ...rest }) => (
  <SMIcon icon="icon-icon-map-options" {...rest} />
);


// Function to get right icon based on key mapping
export const getIcon = (key, props) => {
  switch (key) {
    case 'foot':
      return <OnFootIcon {...props} />;
    case 'colorblind':
      return <ColorblindIcon {...props} />;
    case 'hearingAid':
      return <HearingIcon {...props} />;
    case 'visuallyImpaired':
      return <VisualImpairmentIcon {...props} />;
    case 'reduced_mobility':
      return <ReducedMobilityIcon {...props} />;
    case 'rollator':
      return <RollatorIcon {...props} />;
    case 'wheelchair':
      return <WheelchairIcon {...props} />;
    case 'stroller':
      return <StrollerIcon {...props} />;
    case 'servicemap':
      return <DefaultMapIcon {...props} />;
    case 'ortoImage':
      return <AerialMapIcon {...props} />;
    case 'guideMap':
      return <GuideMapIcon {...props} />;
    default:
      return null;
  }
};
