import Animated from 'react-native-reanimated';
import { GESTURE } from '../../constants';
import type { BottomSheetTransitionConfig } from './types';
export declare const useTransition: ({ animatedIsLayoutReady, animationDuration, animationEasing, contentPanGestureState, contentPanGestureTranslationY, contentPanGestureVelocityY, handlePanGestureState, handlePanGestureTranslationY, handlePanGestureVelocityY, scrollableContentOffsetY, snapPoints: _snapPoints, currentIndexRef, initialPosition, onAnimate, }: BottomSheetTransitionConfig) => {
    position: Animated.Node<number>;
    translateY: Animated.Node<number>;
    manualSnapToPoint: Animated.Value<number>;
    currentPosition: Animated.Value<number>;
    currentGesture: Animated.Value<GESTURE>;
};
