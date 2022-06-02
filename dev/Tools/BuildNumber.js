const package = require("../../package.json");
const { generate } = require("build-number-generator");

package.build = generate(package.version);
console.log(`Build ${package.build} ready`);

require("fs").writeFileSync("./package.json", JSON.stringify(package, null, 4));