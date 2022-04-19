"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _reactNativeGestureHandler = require("react-native-gesture-handler");

var _reactNativeReanimated = _interopRequireDefault(require("react-native-reanimated"));

var _lodash = _interopRequireDefault(require("lodash.isequal"));

var _bottomSheetHandle = _interopRequireDefault(require("../bottomSheetHandle"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

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
  const shouldRenderHandle = (0, _react.useMemo)(() => _providedHandleComponent !== null, [_providedHandleComponent]); //#endregion
  //#region callbacks

  const handleOnLayout = (0, _react.useCallback)(({
    nativeEvent: {
      layout: {
        height
      }
    }
  }) => {
    onMeasureHeight(height);
  }, [onMeasureHeight]); //#endregion
  //#region renders

  const renderHandle = (0, _react.useCallback)(() => {
    if (_providedHandleComponent === null) {
      return null;
    }

    const HandleComponent = _providedHandleComponent === undefined ? _bottomSheetHandle.default : _providedHandleComponent;
    return /*#__PURE__*/_react.default.createElement(HandleComponent, {
      animatedIndex: animatedIndex,
      animatedPosition: animatedPosition
    });
  }, [animatedIndex, animatedPosition, _providedHandleComponent]); // console.log(
  //   'BottomSheetHandleContainer',
  //   'render',
  //   shouldRenderHandle,
  //   shouldMeasureHeight
  // );

  return shouldRenderHandle ? /*#__PURE__*/_react.default.createElement(_reactNativeGestureHandler.PanGestureHandler, {
    simultaneousHandlers: simultaneousHandlers,
    shouldCancelWhenOutside: false,
    enabled: enableHandlePanningGesture,
    onGestureEvent: onGestureEvent,
    onHandlerStateChange: onHandlerStateChange
  }, /*#__PURE__*/_react.default.createElement(_reactNativeReanimated.default.View, {
    accessible: true,
    accessibilityRole: "adjustable",
    accessibilityLabel: "Bottom Sheet handle",
    accessibilityHint: "Drag up or down to extend or minimize the Bottom Sheet",
    onLayout: shouldMeasureHeight ? handleOnLayout : undefined
  }, renderHandle())) : null; //#endregion
};

const BottomSheetHandleContainer = /*#__PURE__*/(0, _react.memo)(BottomSheetHandleContainerComponent, _lodash.default);
var _default = BottomSheetHandleContainer;
exports.default = _default;
//# sourceMappingURL=BottomSheetHandleContainer.js.map