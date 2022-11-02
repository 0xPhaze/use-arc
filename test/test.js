var assert = require("assert");
var { expect } = require("chai");

const { useArc, getRequestSignature, useArcWrap } = require("../src/index.ts");

async function func1() {
  return new Promise((resolve) => {
    setTimeout(() => resolve("ret1"), 10);
  });
}

async function func2() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...arguments]);
    }, 10);
  });
}

describe("Array", function () {
  describe("#getRequestSignature()", function () {
    it("should return correct function signature", function () {
      expect(getRequestSignature(func1, [1, 2], "hello")).to.equal('func1([1,2],"hello")');
    });
  });

  describe("#subscribe()", function () {
    it("should queue calls and return func1 ret1", async function () {
      const args = ["abc"];
      const key = useArc.store.getState().queueCall(func1, ...args);

      expect(useArc.store.getState().cachedResults[key]).to.equal(undefined);
      expect(useArc.store.getState().getQueryResult(func1, args)).to.equal(undefined);
      expect(useArc.store.getState().queuedCalls[key]).to.eql({ func: func1, args });

      return new Promise((resolve) => {
        useArc.store.subscribe((state) => state.cachedResults[key], resolve);
      }).then((res) => {
        expect(res).to.equal("ret1");
        expect(useArc.store.getState().getQueryResult(func1, ...args)).to.equal("ret1");
        expect(useArc.store.getState().queuedCalls[key]).to.equal(undefined);
      });
    });

    it("should return func1 ret1 cached result", async function () {
      const args = ["abc"];
      const key = useArc.store.getState().queueCall(func1, ...args);

      expect(useArc.store.getState().cachedResults[key]).to.equal("ret1");
      expect(useArc.store.getState().getQueryResult(func1, args)).to.equal("ret1");
    });

    it("should not retrigger during call", async function () {
      const args = ["abc"];

      let numFuncExecuted = 0;

      async function funcx() {
        numFuncExecuted++;

        return new Promise((resolve) => {
          setTimeout(() => {
            resolve([...arguments]);
          }, 10);
        });
      }

      const key = useArc.store.getState().queueCall(funcx, ...args);

      useArc.store.getState().queueCall(funcx, ...args);
      useArc.store.getState().queueCall(funcx, ...args);

      return new Promise((resolve) => {
        useArc.store.subscribe((state) => state.cachedResults[key], resolve);
      })
        .then((res) => expect(res).to.eql(args))
        .then(() => new Promise((resolve) => setTimeout(resolve, 20)))
        .then(() => expect(numFuncExecuted).to.equal(1));
    });

    it("should return func2 arguments", async function () {
      const args = ["abc", 1, { a: 123, b: undefined }];
      const key = useArc.store.getState().queueCall(func2, ...args);

      return new Promise((resolve) => {
        useArc.store.subscribe((state) => state.cachedResults[key], resolve);
      }).then((res) => expect(res).to.eql(args));
    });
  });
  describe("#Arc()", function () {
    it("should correctly wrap functions", async function () {
      const wrapped = useArcWrap(async function funcx(a, b) {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve([...arguments]);
          }, 10);
        });
      });

      const args = [1, 2, "34"];

      expect(wrapped.name).to.equal("funcx");
      expect(wrapped.length).to.equal(2);
      expect(await wrapped(...args)).to.eql(args);
    });

    it("should correctly wrap anonymous functions", async function () {
      const wrapped = useArcWrap(async (a, b, c) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve([a, b, c]);
          }, 10);
        });
      }, "funcy");

      const args = [1, 2, "34"];

      expect(wrapped.name).to.equal("funcy");
      expect(wrapped.length).to.equal(3);
      expect(await wrapped(...args)).to.eql(args);
    });
  });
});
