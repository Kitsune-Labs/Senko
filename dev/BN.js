const fs = require("fs");
const Data = require("../src/Data/DataConfig.json");
const date = Date.now();

Data.buildNumber = Math.floor(date.toString());

fs.writeFileSync("./src/Data/DataConfig.json", JSON.stringify(Data, null, 4));