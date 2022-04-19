import React, { memo, useCallback, useMemo } from 'react';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import isEqual from 'lodash.isequal';
import BottomSheetHandle from '../bottomSheetHandle';

const BottomSheetHandleContainerComponent = ({
  animatedIndex,
  animatedPosition,
  simultaneousHandlers,
  enableHandlePanningGesture,
  shouldMeasureHeight,
  handleComponent: _providedHandleComponent,
  onGestureEvent,
  onHandlerStateChange,
  onMeasureHeight
}) => {
  //#region variables
  const shouldRenderHandle = useMemo(() => _providedHandleComponent !== null, [_providedHandleComponent]); //#endregion
  //#region callbacks

  const handleOnLayout = useCallback(({
    nativeEvent: {
      layout: {
        height
      }
    }
  }) => {
    onMeasureHeight(height);
  }, [onMeasureHeight]); //#endregion
  //#region renders

  const renderHandle = useCallback(() => {
    if (_providedHandleComponent === null) {
      return null;
    }

    const HandleComponent = _providedHandleComponent === undefined ? BottomSheetHandle : _providedHandleComponent;
    return /*#__PURE__*/React.createElement(HandleComponent, {
      animatedIndex: animatedIndex,
      animatedPosition: animatedPosition
    });
  }, [animatedIndex, animatedPosition, _providedHandleComponent]); // console.log(
  //   'BottomSheetHandleContainer',
  //   'render',
  //   shouldRenderHandle,
  //   shouldMeasureHeight
  // );

  return shouldRenderHandle ? /*#__PURE__*/React.createElement(PanGestureHandler, {
    simultaneousHandlers: simultaneousHandlers,
    shouldCancelWhenOutside: false,
    enabled: enableHandlePanningGesture,
    onGestureEvent: onGestureEvent,
    onHandlerStateChange: onHandlerStateChange
  }, /*#__PURE__*/React.createElement(Animated.View, {
    accessible: true,
    accessibilityRole: "adjustable",
    accessibilityLabel: "Bottom Sheet handle",
    accessibilityHint: "Drag up or down to extend or minimize the Bottom Sheet",
    onLayout: shouldMeasureHeight ? handleOnLayout : undefined
  }, renderHandle())) : null; //#endregion
};

const BottomSheetHandleContainer = /*#__PURE__*/memo(BottomSheetHandleContainerComponent, isEqual);
export default BottomSheetHandleContainer;
//# sourceMappingURL=BottomSheetHandleContainer.js.map