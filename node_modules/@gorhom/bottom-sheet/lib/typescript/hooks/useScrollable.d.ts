import { RefObject } from 'react';
import Animated from 'react-native-reanimated';
import type { ScrollableRef, Scrollable } from '../types';
export declare const useScrollable: () => {
    scrollableRef: RefObject<ScrollableRef>;
    scrollableContentOffsetY: Animated.Value<number>;
    setScrollableRef: (ref: ScrollableRef) => void;
    removeScrollableRef: (ref: RefObject<Scrollable>) => void;
    scrollToTop: () => void;
    flashScrollableIndicators: () => void;
};
