let memoizeCache: any = {};

export const wipeMemoizeCache = () => {
  memoizeCache = {};
};

const memoize = (method: Function) =>
  async function(this: any, ...args: any[]) {
    const json = JSON.stringify(args);
    memoizeCache[json] = memoizeCache[json] || method.apply(this, args);
    return memoizeCache[json];
  };

export default memoize;
