/// <reference types="react" />
import Animated from 'react-native-reanimated';
interface BottomSheetDebugViewProps {
    values: Record<string, Animated.Value<number> | Animated.Node<number>>;
}
declare const BottomSheetDebugView: ({ values }: BottomSheetDebugViewProps) => JSX.Element;
export default BottomSheetDebugView;
