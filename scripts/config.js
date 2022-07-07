module.exports = {
  exit: null,
  path: Version.combined().replace(/\s/g, "-"),
  skip: null,
};

for (let k in module.exports) {
  let env = OS.env("PULVERIZER_" + k.toUpperCase());
  if (env !== null) {
    module.exports[k] = env;
  }
}
