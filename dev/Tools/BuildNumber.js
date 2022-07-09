const package = require("../../package.json");
const build = require("build-number-generator");

package.build = build.generate(package.version);
console.log(`Build ${package.build} ready`);

require("fs").writeFileSync("./package.json", JSON.stringify(package, null, 4));