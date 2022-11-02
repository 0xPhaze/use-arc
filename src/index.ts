import create from "zustand";
import shallow from "zustand/shallow";
import { subscribeWithSelector } from "zustand/middleware";

const verbosity = 0;

export const useArcStore = create(
  subscribeWithSelector((set: Function, get: Function) => ({
    cachedResults: {},
    queuedCalls: {},
    getQueryResult(func: Function, ...args: any[]): any {
      const key = getRequestSignature(func, ...args);

      if (key != null) {
        const val = get().cachedResults[key];

        if (key in get().cachedResults && val != undefined) {
          if (verbosity > 0) console.log("Arc: Reading cache", key);

          return get().cachedResults[key];
        }

        get().queueCall(func, ...args);
      }
    },
    queueCall(func: Function, ...args: any[]) {
      const key = getRequestSignature(func, ...args);

      if (key != null) {
        if (!(key in get().queuedCalls)) {
          if (verbosity > 0) console.log("Arc: Queueing call", key);

          get().queuedCalls = {
            ...get().queuedCalls,
            [key]: { func, args },
          };

          func(...args).then((result: any) => {
            if (verbosity > 0) console.log("Arc: key", key, "received", result);

            set({
              cachedResults: Object.assign(get().cachedResults, { [key]: result }),
            });

            delete get().queuedCalls[key];
          });
        } else {
          if (verbosity > 0) console.log("Arc: Call already queued", key);
        }
      }
      return key;
    },
  }))
);

export function getRequestSignature(func: Function, ...args: any[]): string | null {
  if (func.name == undefined || func.name == "") throw new Error("Function name cannot be undefined.");
  if (args.some((arg) => arg === null)) return null;
  return func.name + `(${args.map((arg: any) => JSON.stringify(arg)).join(",")})`;
}

export const useArc = (func: Function, ...args: any) => {
  return useArcStore(
    ({ getQueryResult, queueCall }: { getQueryResult: Function; queueCall: Function }) =>
      [getQueryResult(func, ...args), () => queueCall(func, ...args), getRequestSignature(func, ...args)] as any,
    ([a]: [any], [b]: [any]) => shallow(a, b) // this only updates after a successful result
  );
};

useArc.store = useArcStore;

export function useArcWrap(func: Function, funcName = "") {
  if ((func.name == undefined || func.name == "") && funcName == "")
    throw new Error("Function name cannot be undefined.");

  const wrapped = new Proxy(
    function (this: any) {
      return func.apply(this, arguments);
    },
    {
      get(target: any, prop): any {
        if (prop == "name") return func.name || funcName;
        if (prop == "length") return func.length;
        return target[prop];
      },
    }
  );

  return (...args: any[]) => useArc(wrapped, ...args);
}
