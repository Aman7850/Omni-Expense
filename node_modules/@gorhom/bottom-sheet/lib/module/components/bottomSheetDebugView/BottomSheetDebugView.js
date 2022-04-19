import React from 'react';
import { View } from 'react-native';
import { concat } from 'react-native-reanimated';
import { ReText } from 'react-native-redash';
import { styles } from './styles';

const BottomSheetDebugView = ({
  values
}) => {
  return /*#__PURE__*/React.createElement(View, {
    pointerEvents: "none",
    style: styles.container
  }, Object.keys(values).map(key => /*#__PURE__*/React.createElement(ReText, {
    key: "item-".concat(key),
    style: styles.text,
    text: concat("".concat(key, ": "), values[key])
  })));
};

export default BottomSheetDebugView;
//# sourceMappingURL=BottomSheetDebugView.js.map