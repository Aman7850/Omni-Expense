"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _lodash = _interopRequireDefault(require("lodash.isequal"));

var _reactNativeReanimated = _interopRequireWildcard(require("react-native-reanimated"));

var _reactNativeGestureHandler = require("react-native-gesture-handler");

var _hooks = require("../../hooks");

var _styles = require("./styles");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const BottomSheetDraggableViewComponent = ({
  nativeGestureRef,
  gestureType = 'HANDLE',
  style,
  children,
  ...rest
}) => {
  // refs
  const panGestureRef = (0, _react.useRef)(null); // hooks

  const {
    enableContentPanningGesture,
    containerTapGestureRef,
    handlePanGestureState,
    handlePanGestureTranslationY,
    handlePanGestureVelocityY,
    contentPanGestureState,
    contentPanGestureTranslationY,
    contentPanGestureVelocityY
  } = (0, _hooks.useBottomSheetInternal)(); // variables

  const simultaneousHandlers = (0, _react.useMemo)(() => nativeGestureRef ? [containerTapGestureRef, nativeGestureRef] : containerTapGestureRef, [containerTapGestureRef, nativeGestureRef]); // styles

  const containerStyle = (0, _react.useMemo)(() => style ? [_styles.styles.container, style] : _styles.styles.container, [style]); // callbacks

  const handleGestureEvent = (0, _react.useMemo)(() => gestureType === 'CONTENT' ? (0, _reactNativeReanimated.event)([{
    nativeEvent: {
      state: contentPanGestureState,
      translationY: contentPanGestureTranslationY,
      velocityY: contentPanGestureVelocityY
    }
  }]) : (0, _reactNativeReanimated.event)([{
    nativeEvent: {
      state: handlePanGestureState,
      translationY: handlePanGestureTranslationY,
      velocityY: handlePanGestureVelocityY
    }
  }]), [gestureType, contentPanGestureState, contentPanGestureTranslationY, contentPanGestureVelocityY, handlePanGestureState, handlePanGestureTranslationY, handlePanGestureVelocityY]); // effects

  return /*#__PURE__*/_react.default.createElement(_reactNativeGestureHandler.PanGestureHandler, {
    ref: panGestureRef,
    enabled: enableContentPanningGesture,
    simultaneousHandlers: simultaneousHandlers,
    shouldCancelWhenOutside: false,
    onGestureEvent: handleGestureEvent,
    onHandlerStateChange: handleGestureEvent
  }, /*#__PURE__*/_react.default.createElement(_reactNativeReanimated.default.View, _extends({
    style: containerStyle
  }, rest), children));
};

const BottomSheetDraggableView = /*#__PURE__*/(0, _react.memo)(BottomSheetDraggableViewComponent, _lodash.default);
var _default = BottomSheetDraggableView;
exports.default = _default;
//# sourceMappingURL=BottomSheetDraggableView.js.map