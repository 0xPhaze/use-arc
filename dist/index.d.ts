export declare const useArcStore: import("zustand").UseBoundStore<Omit<import("zustand").StoreApi<{
    cachedResults: {};
    queuedCalls: {};
    getQueryResult(func: Function, ...args: any[]): any;
    queueCall(func: Function, ...args: any[]): string | null;
}>, "subscribe"> & {
    subscribe: {
        (listener: (selectedState: {
            cachedResults: {};
            queuedCalls: {};
            getQueryResult(func: Function, ...args: any[]): any;
            queueCall(func: Function, ...args: any[]): string | null;
        }, previousSelectedState: {
            cachedResults: {};
            queuedCalls: {};
            getQueryResult(func: Function, ...args: any[]): any;
            queueCall(func: Function, ...args: any[]): string | null;
        }) => void): () => void;
        <U>(selector: (state: {
            cachedResults: {};
            queuedCalls: {};
            getQueryResult(func: Function, ...args: any[]): any;
            queueCall(func: Function, ...args: any[]): string | null;
        }) => U, listener: (selectedState: U, previousSelectedState: U) => void, options?: {
            equalityFn?: ((a: U, b: U) => boolean) | undefined;
            fireImmediately?: boolean | undefined;
        } | undefined): () => void;
    };
}>;
export declare function getRequestSignature(func: Function, ...args: any[]): string | null;
export declare const useArc: {
    (func: Function, ...args: any): [any];
    store: import("zustand").UseBoundStore<Omit<import("zustand").StoreApi<{
        cachedResults: {};
        queuedCalls: {};
        getQueryResult(func: Function, ...args: any[]): any;
        queueCall(func: Function, ...args: any[]): string | null;
    }>, "subscribe"> & {
        subscribe: {
            (listener: (selectedState: {
                cachedResults: {};
                queuedCalls: {};
                getQueryResult(func: Function, ...args: any[]): any;
                queueCall(func: Function, ...args: any[]): string | null;
            }, previousSelectedState: {
                cachedResults: {};
                queuedCalls: {};
                getQueryResult(func: Function, ...args: any[]): any;
                queueCall(func: Function, ...args: any[]): string | null;
            }) => void): () => void;
            <U>(selector: (state: {
                cachedResults: {};
                queuedCalls: {};
                getQueryResult(func: Function, ...args: any[]): any;
                queueCall(func: Function, ...args: any[]): string | null;
            }) => U, listener: (selectedState: U, previousSelectedState: U) => void, options?: {
                equalityFn?: ((a: U, b: U) => boolean) | undefined;
                fireImmediately?: boolean | undefined;
            } | undefined): () => void;
        };
    }>;
};
export declare function useArcWrap(func: Function, funcName?: string): (...args: any[]) => [any];
