import React, { forwardRef, memo } from 'react';
import isEqual from 'lodash.isequal';
import { TapGestureHandler } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
const BottomSheetContentWrapperComponent = /*#__PURE__*/forwardRef(({
  children,
  onGestureEvent,
  onHandlerStateChange
}, ref) => {
  return /*#__PURE__*/React.createElement(TapGestureHandler, {
    ref: ref,
    maxDurationMs: 1000000,
    shouldCancelWhenOutside: false,
    onGestureEvent: onGestureEvent,
    onHandlerStateChange: onHandlerStateChange
  }, /*#__PURE__*/React.createElement(Animated.View, {
    pointerEvents: "box-none"
  }, children));
});
const BottomSheetContentWrapper = /*#__PURE__*/memo(BottomSheetContentWrapperComponent, isEqual);
export default BottomSheetContentWrapper;
//# sourceMappingURL=BottomSheetContentWrapper.ios.js.map