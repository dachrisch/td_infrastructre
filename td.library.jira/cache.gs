class Cache {
  constructor(array) {
    this.m = new Map(array);
  }
  delete(key) {
    return this.m.delete(this.preProcess(key));
  }
  get(key) {
    return this.m.get(this.preProcess(key));
  }
  has(key) {
    return this.m.has(this.preProcess(key));
  }

  set(key, value) {
    return this.m.set(this.preProcess(key), value);
  }
  /*
   This is the method that will convert an object into a custom key.  It takes a parameter and returns it's processed key value.  If the type of parameter is primitive, it will return it unchanged.  Otherwise, the JSON.stringify will be called on the argument and the resulting value will be returned.  
  */

  preProcess(key) {
    if (typeof key === 'object') {
      return JSON.stringify(key);
    } else {
      return key;
    }
  }
}