"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useArcWrap = exports.useArc = exports.getRequestSignature = exports.useArcStore = void 0;
const zustand_1 = __importDefault(require("zustand"));
const shallow_1 = __importDefault(require("zustand/shallow"));
const middleware_1 = require("zustand/middleware");
const verbosity = 0;
exports.useArcStore = (0, zustand_1.default)((0, middleware_1.subscribeWithSelector)((set, get) => ({
    cachedResults: {},
    queuedCalls: {},
    getQueryResult(func, ...args) {
        const key = getRequestSignature(func, ...args);
        if (key != null) {
            const val = get().cachedResults[key];
            if (key in get().cachedResults && val != undefined) {
                if (verbosity > 0)
                    console.log("Arc: Reading cache", key);
                return get().cachedResults[key];
            }
            get().queueCall(func, ...args);
        }
    },
    queueCall(func, ...args) {
        const key = getRequestSignature(func, ...args);
        if (key != null) {
            if (!(key in get().queuedCalls)) {
                if (verbosity > 0)
                    console.log("Arc: Queueing call", key);
                get().queuedCalls = {
                    ...get().queuedCalls,
                    [key]: { func, args },
                };
                func(...args).then((result) => {
                    if (verbosity > 0)
                        console.log("Arc: key", key, "received", result);
                    set({
                        cachedResults: Object.assign(get().cachedResults, { [key]: result }),
                    });
                    delete get().queuedCalls[key];
                });
            }
            else {
                if (verbosity > 0)
                    console.log("Arc: Call already queued", key);
            }
        }
        return key;
    },
})));
function getRequestSignature(func, ...args) {
    if (func.name == undefined || func.name == "")
        throw new Error("Function name cannot be undefined.");
    if (args.some((arg) => arg === null))
        return null;
    return func.name + `(${args.map((arg) => JSON.stringify(arg)).join(",")})`;
}
exports.getRequestSignature = getRequestSignature;
const useArc = (func, ...args) => {
    return (0, exports.useArcStore)(({ getQueryResult, queueCall }) => [getQueryResult(func, ...args), () => queueCall(func, ...args), getRequestSignature(func, ...args)], ([a], [b]) => (0, shallow_1.default)(a, b) // this only updates after a successful result
    );
};
exports.useArc = useArc;
exports.useArc.store = exports.useArcStore;
function useArcWrap(func, funcName = "") {
    if ((func.name == undefined || func.name == "") && funcName == "")
        throw new Error("Function name cannot be undefined.");
    const wrapped = new Proxy(function () {
        return func.apply(this, arguments);
    }, {
        get(target, prop) {
            if (prop == "name")
                return func.name || funcName;
            if (prop == "length")
                return func.length;
            return target[prop];
        },
    });
    return (...args) => (0, exports.useArc)(wrapped, ...args);
}
exports.useArcWrap = useArcWrap;
