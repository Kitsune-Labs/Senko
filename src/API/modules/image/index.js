const path = require("path");
const fs = require("fs");

module.exports = function (dir, callback) {
    fs.readdir(dir, (err, files) => {
        if (err) return callback(err);

        function checkRandom() {
            if (!files.length) return callback(null, undefined);

            const randomIndex = Math.floor(Math.random() * files.length);
            const file = files[randomIndex];
            fs.stat(path.join(dir, file), (err, stats) => {
                if (err) return callback(err);
                if (stats.isFile()) return callback(null, file);

                files.splice(randomIndex, 1);

                checkRandom();
            });
        }
        checkRandom();
    });
};