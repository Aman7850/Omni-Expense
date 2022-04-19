import React, { memo } from 'react';
import { View } from 'react-native';
import isEqual from 'lodash.isequal';
import { styles } from './styles';

const BottomSheetHandleComponent = () => {
  return /*#__PURE__*/React.createElement(View, {
    style: styles.container
  }, /*#__PURE__*/React.createElement(View, {
    style: styles.indicator
  }));
};

const BottomSheetHandle = /*#__PURE__*/memo(BottomSheetHandleComponent, isEqual);
export default BottomSheetHandle;
//# sourceMappingURL=BottomSheetHandle.js.map