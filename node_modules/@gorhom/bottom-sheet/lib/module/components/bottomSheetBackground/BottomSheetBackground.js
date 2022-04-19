import React, { memo } from 'react';
import { View } from 'react-native';
import isEqual from 'lodash.isequal';
import { styles } from './styles';

const BottomSheetBackgroundComponent = ({
  pointerEvents,
  style
}) => /*#__PURE__*/React.createElement(View, {
  pointerEvents: pointerEvents,
  style: [style, styles.container]
});

const BottomSheetBackground = /*#__PURE__*/memo(BottomSheetBackgroundComponent, isEqual);
export default BottomSheetBackground;
//# sourceMappingURL=BottomSheetBackground.js.map