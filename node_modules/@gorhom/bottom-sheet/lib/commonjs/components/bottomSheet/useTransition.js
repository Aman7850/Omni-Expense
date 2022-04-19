"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useTransition = void 0;

var _react = require("react");

var _reactNativeReanimated = _interopRequireWildcard(require("react-native-reanimated"));

var _reactNativeGestureHandler = require("react-native-gesture-handler");

var _reactNativeRedash = require("react-native-redash");

var _constants = require("../../constants");

var _hooks = require("../../hooks");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const useTransition = ({
  animatedIsLayoutReady,
  animationDuration,
  animationEasing,
  contentPanGestureState,
  contentPanGestureTranslationY,
  contentPanGestureVelocityY,
  handlePanGestureState,
  handlePanGestureTranslationY,
  handlePanGestureVelocityY,
  scrollableContentOffsetY,
  snapPoints: _snapPoints,
  currentIndexRef,
  initialPosition,
  onAnimate
}) => {
  const currentGesture = (0, _reactNativeRedash.useValue)(_constants.GESTURE.UNDETERMINED);
  const currentPosition = (0, _hooks.useReactiveValue)(initialPosition);
  const snapPoints = (0, _hooks.useReactiveValues)(_snapPoints);
  const isPanningContent = (0, _react.useMemo)(() => (0, _reactNativeReanimated.eq)(contentPanGestureState, _reactNativeGestureHandler.State.ACTIVE), [contentPanGestureState]);
  const isPanningHandle = (0, _react.useMemo)(() => (0, _reactNativeReanimated.eq)(handlePanGestureState, _reactNativeGestureHandler.State.ACTIVE), [handlePanGestureState]);
  const isPanning = (0, _react.useMemo)(() => (0, _reactNativeReanimated.or)(isPanningContent, isPanningHandle), [isPanningContent, isPanningHandle]);
  const shouldAnimate = (0, _reactNativeRedash.useValue)(0);
  const manualSnapToPoint = (0, _reactNativeRedash.useValue)(-1);
  const clock = (0, _reactNativeRedash.useClock)();
  const config = (0, _react.useMemo)(() => ({
    toValue: new _reactNativeReanimated.default.Value(-1),
    duration: animationDuration,
    easing: animationEasing
  }), [animationEasing, animationDuration]);
  const animationState = (0, _react.useMemo)(() => ({
    finished: new _reactNativeReanimated.default.Value(0),
    position: new _reactNativeReanimated.default.Value(initialPosition),
    frameTime: new _reactNativeReanimated.default.Value(0),
    time: new _reactNativeReanimated.default.Value(0)
  }), // eslint-disable-next-line react-hooks/exhaustive-deps
  []);
  const finishTiming = (0, _react.useMemo)(() => [// debug('finish timing', config.toValue),
  (0, _reactNativeReanimated.set)(currentGesture, _constants.GESTURE.UNDETERMINED), (0, _reactNativeReanimated.set)(shouldAnimate, 0), (0, _reactNativeReanimated.set)(currentPosition, config.toValue), (0, _reactNativeReanimated.set)(animationState.frameTime, 0), (0, _reactNativeReanimated.set)(animationState.time, 0), (0, _reactNativeReanimated.stopClock)(clock)], [animationState.frameTime, animationState.time, clock, config.toValue, currentGesture, currentPosition, shouldAnimate]);
  const translateY = (0, _react.useMemo)(() => (0, _reactNativeReanimated.cond)((0, _reactNativeReanimated.eq)(currentGesture, _constants.GESTURE.CONTENT), (0, _reactNativeReanimated.cond)((0, _reactNativeReanimated.eq)(currentPosition, snapPoints[snapPoints.length - 1]), (0, _reactNativeReanimated.add)(contentPanGestureTranslationY, (0, _reactNativeReanimated.multiply)(scrollableContentOffsetY, -1)), contentPanGestureTranslationY), handlePanGestureTranslationY), [snapPoints, currentGesture, currentPosition, contentPanGestureTranslationY, handlePanGestureTranslationY, scrollableContentOffsetY]);
  const velocityY = (0, _react.useMemo)(() => (0, _reactNativeReanimated.cond)((0, _reactNativeReanimated.eq)(currentGesture, _constants.GESTURE.CONTENT), contentPanGestureVelocityY, handlePanGestureVelocityY), [contentPanGestureVelocityY, handlePanGestureVelocityY, currentGesture]);
  const isAnimationInterrupted = (0, _react.useMemo)(() => (0, _reactNativeReanimated.and)((0, _reactNativeReanimated.clockRunning)(clock), (0, _reactNativeReanimated.or)(isPanning, (0, _reactNativeReanimated.and)((0, _reactNativeReanimated.neq)(manualSnapToPoint, -1), (0, _reactNativeReanimated.neq)(manualSnapToPoint, config.toValue)))), [clock, isPanning, config.toValue, manualSnapToPoint]);
  const position = (0, _react.useMemo)(() => (0, _reactNativeReanimated.block)([(0, _reactNativeReanimated.cond)(animatedIsLayoutReady, [// debug('current gesture', currentGesture),

  /**
   * In case animation get interrupted, we execute the finishTiming node and
   * set current position the the animated position.
   */
  (0, _reactNativeReanimated.cond)(isAnimationInterrupted, [// debug('animation interrupted', isAnimationInterrupted),
  finishTiming, (0, _reactNativeReanimated.set)(currentPosition, animationState.position)]),
  /**
   * Panning node
   */
  (0, _reactNativeReanimated.cond)(isPanning, [(0, _reactNativeReanimated.set)(currentGesture, (0, _reactNativeReanimated.cond)(isPanningContent, _constants.GESTURE.CONTENT, _constants.GESTURE.HANDLE)), // debug('start panning', translateY),
  (0, _reactNativeReanimated.cond)((0, _reactNativeReanimated.not)((0, _reactNativeReanimated.greaterOrEq)((0, _reactNativeReanimated.add)(currentPosition, translateY), snapPoints[snapPoints.length - 1])), [(0, _reactNativeReanimated.set)(animationState.position, snapPoints[snapPoints.length - 1]), (0, _reactNativeReanimated.set)(animationState.finished, 0)], (0, _reactNativeReanimated.cond)((0, _reactNativeReanimated.not)((0, _reactNativeReanimated.lessOrEq)((0, _reactNativeReanimated.add)(currentPosition, translateY), snapPoints[0])), [(0, _reactNativeReanimated.set)(animationState.position, snapPoints[0]), (0, _reactNativeReanimated.set)(animationState.finished, 0)], [(0, _reactNativeReanimated.set)(animationState.position, (0, _reactNativeReanimated.add)(currentPosition, translateY)), (0, _reactNativeReanimated.set)(animationState.finished, 0)]))]),
  /**
   * Gesture ended node.
   */
  (0, _reactNativeReanimated.onChange)((0, _reactNativeReanimated.add)(contentPanGestureState, handlePanGestureState), (0, _reactNativeReanimated.cond)((0, _reactNativeReanimated.or)((0, _reactNativeReanimated.and)((0, _reactNativeReanimated.eq)(currentGesture, _constants.GESTURE.CONTENT), (0, _reactNativeReanimated.eq)(contentPanGestureState, _reactNativeGestureHandler.State.END)), (0, _reactNativeReanimated.and)((0, _reactNativeReanimated.eq)(currentGesture, _constants.GESTURE.HANDLE), (0, _reactNativeReanimated.eq)(handlePanGestureState, _reactNativeGestureHandler.State.END))), [// debug('gesture end', currentGesture),
  (0, _reactNativeReanimated.set)(config.toValue, (0, _reactNativeRedash.snapPoint)((0, _reactNativeReanimated.add)(currentPosition, translateY), velocityY, snapPoints)),
  /**
   * here we make sure that captured gesture was not the content scrolling.
   */
  (0, _reactNativeReanimated.cond)((0, _reactNativeReanimated.neq)(config.toValue, animationState.position), (0, _reactNativeReanimated.set)(shouldAnimate, 1), finishTiming)])),
  /**
   * Manual snapping node.
   */
  (0, _reactNativeReanimated.cond)((0, _reactNativeReanimated.and)((0, _reactNativeReanimated.neq)(manualSnapToPoint, -1), (0, _reactNativeReanimated.or)((0, _reactNativeReanimated.neq)(manualSnapToPoint, currentPosition), (0, _reactNativeReanimated.neq)(manualSnapToPoint, animationState.position)), (0, _reactNativeReanimated.neq)(manualSnapToPoint, config.toValue)), [// debug('manualSnapToPoint', manualSnapToPoint),
  (0, _reactNativeReanimated.set)(config.toValue, manualSnapToPoint), (0, _reactNativeReanimated.set)(animationState.finished, 0), (0, _reactNativeReanimated.set)(shouldAnimate, 1), (0, _reactNativeReanimated.set)(manualSnapToPoint, -1)], (0, _reactNativeReanimated.set)(manualSnapToPoint, -1)),
  /**
   * Animation Node.
   */
  (0, _reactNativeReanimated.cond)(shouldAnimate, [// debug('animating', shouldAnimate),
  (0, _reactNativeReanimated.cond)((0, _reactNativeReanimated.and)((0, _reactNativeReanimated.not)((0, _reactNativeReanimated.clockRunning)(clock)), (0, _reactNativeReanimated.not)(animationState.finished)), [// debug('start animating', shouldAnimate),

  /**
   * `onAnimate` node
   */
  (0, _reactNativeReanimated.call)([config.toValue, ...snapPoints], ([_toValue, ..._animatedSnapPoints]) => {
    const currentIndex = currentIndexRef.current;

    const nextIndex = _animatedSnapPoints.indexOf(_toValue);

    if (onAnimate) {
      onAnimate(currentIndex, nextIndex);
    }
  }), (0, _reactNativeReanimated.set)(animationState.finished, 0), (0, _reactNativeReanimated.set)(animationState.frameTime, 0), (0, _reactNativeReanimated.set)(animationState.time, 0), (0, _reactNativeReanimated.startClock)(clock)]), (0, _reactNativeReanimated.timing)(clock, animationState, config), (0, _reactNativeReanimated.cond)(animationState.finished, finishTiming)]), animationState.position], 0)]), [animatedIsLayoutReady, animationState, clock, config, currentGesture, currentPosition, finishTiming, isAnimationInterrupted, isPanning, isPanningContent, manualSnapToPoint, shouldAnimate, snapPoints, translateY, velocityY, contentPanGestureState, handlePanGestureState, currentIndexRef, onAnimate]);
  return {
    position,
    translateY,
    manualSnapToPoint,
    currentPosition,
    currentGesture
  };
};

exports.useTransition = useTransition;
//# sourceMappingURL=useTransition.js.map