// Empty stub: replaces node:* built-in imports on the edge runtime.
// The Anthropic SDK's agent-toolset submodules import these at parse time
// but we never CALL them, so returning empty exports is safe.
module.exports = {};
module.exports.execFile = () => {
  throw new Error("Node built-in modules are not available on the edge runtime");
};
module.exports.spawn = () => {
  throw new Error("Node built-in modules are not available on the edge runtime");
};
