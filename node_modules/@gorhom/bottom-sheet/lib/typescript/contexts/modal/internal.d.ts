import { Ref } from 'react';
import type BottomSheet from '../../components/bottomSheet';
export interface BottomSheetModalInternalContextType {
    containerHeight: number;
    mountSheet: (key: string, ref: Ref<BottomSheet>) => void;
    unmountSheet: (key: string) => void;
    willUnmountSheet: (key: string) => void;
}
export declare const BottomSheetModalInternalContext: import("react").Context<BottomSheetModalInternalContextType>;
export declare const BottomSheetModalInternalProvider: import("react").Provider<BottomSheetModalInternalContextType>;
