const fs = require("fs");
const path = require("path");

const directoryPath = path.join(__dirname, "Items");
let marketData = {};

fs.readdir(directoryPath, (err, files) => {
	if (err) {
		console.error(`Error reading directory: ${err}`);
		return;
	}

	files.forEach((file) => {
		const filePath = path.join(directoryPath, file);
		fs.readFile(filePath, "utf8", (err, data) => {
			if (err) {
				console.error(`Error reading file: ${err}`);
				return;
			}

			// Check if the file is empty
			if (!data) {
				console.log(`File ${file} is empty`);
				return;
			}
			// Parse the file data as JSON
			let fileData;
			try {
				fileData = JSON.parse(data);
			} catch (err) {
				console.error(`Error parsing file data: ${err}`);
				return;
			}
			// Merge the file data into the marketData object
			marketData = { ...marketData, ...fileData };
		});
	});
});

setTimeout(() => {
	if (Object.keys(marketData).length === 0) {
		console.log("There isn't any data!");
		return;
	}
	// Write the marketData object to a file named Market.json
	fs.writeFile("./src/Data/Market/Market.json", JSON.stringify(marketData, null, 2), "utf8", (err) => {
		if (err) {
			console.error(`Error writing file: ${err}`);
			return;
		}
		console.log("Market.json created!");
	});
}, 2000);
