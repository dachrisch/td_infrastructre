const memoize = (fn) => {
  let cache = {};
  return (...args) => {
    let n = args[0];  // just taking one argument here
    let funcName = 'name' in fn? fn.name : fn
    if (n in cache) {
      console.log(`fetching result for ${funcName}(${args}) from cache`);
      return cache[n];
    }
    else {
      console.log(`storing ${funcName}(${args}) in cache`);
      let result = fn(n);
      cache[n] = result;
      return result;
    }
  }
}
