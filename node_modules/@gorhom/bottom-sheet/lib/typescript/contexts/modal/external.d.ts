/// <reference types="react" />
export interface BottomSheetModalContextType {
    dismiss: (key: string) => void;
    dismissAll: () => void;
}
export declare const BottomSheetModalContext: import("react").Context<BottomSheetModalContextType>;
export declare const BottomSheetModalProvider: import("react").Provider<BottomSheetModalContextType>;
