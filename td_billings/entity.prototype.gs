Object.prototype.memberToString = function () {
  return Object.getOwnPropertyNames(this).map((propertyName) => `${propertyName}=${this[propertyName].toString()}`).join(', ')
}

String.prototype.addQuery = function (parameter) {
  return this + "?" + Object.entries(parameter).flatMap(([k, v]) => Array.isArray(v) ? v.map(e => `${k}=${encodeURIComponent(e)}`) : `${k}=${encodeURIComponent(v)}`).join("&");
}

