import React, { memo, useMemo } from 'react';
import isEqual from 'lodash.isequal';
import BottomSheetBackground from '../bottomSheetBackground';
import { styles } from './styles';

const BottomSheetBackgroundContainerComponent = ({
  animatedIndex,
  animatedPosition,
  backgroundComponent: _providedBackgroundComponent
}) => {
  const BackgroundComponent = useMemo(() => _providedBackgroundComponent || BottomSheetBackground, [_providedBackgroundComponent]);
  return _providedBackgroundComponent === null ? null : /*#__PURE__*/React.createElement(BackgroundComponent, {
    pointerEvents: "none",
    animatedIndex: animatedIndex,
    animatedPosition: animatedPosition,
    style: styles.container
  });
};

const BottomSheetBackgroundContainer = /*#__PURE__*/memo(BottomSheetBackgroundContainerComponent, isEqual);
export default BottomSheetBackgroundContainer;
//# sourceMappingURL=BottomSheetBackgroundContainer.js.map