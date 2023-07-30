const fs = require('fs');
const path = require("path");
const mkdirp = require("mkdirp");

const emails = listDirectory('./server/emails/', './dist/server/server/emails/');
const assets = listDirectory('./server/public/assets/', './dist/server/server/public/assets/');

function listDirectory(oldPath, newPath) {
    if (!fs.existsSync(newPath)) {
        mkdirp(newPath, function (err) {
            // if any errors then print the errors to our console
            if (err) console.log(err);
            // else print a success message.
            readandMove()
        });
    }
    readandMove()

    function readandMove() {
        fs.readdir(oldPath, function (err, items) {
            for (var i = 0; i < items.length; i++) {
                move(oldPath + items[i], newPath + items[i], function (err) {
                    console.log(err)
                })
            }
        });
    }
}

function err(error) {
    console.log("ERROR", error);
}

function move(oldPath, newPath, callback) {
    fs.access(oldPath, (err) => {
        if (err) {
            callback(err);
            return;
        }
        copyFile(oldPath, path.join(newPath));
    });

    function copyFile(src, dest) {

        let readStream = fs.createReadStream(src);

        readStream.once('error', (err) => {
            console.log(err);
        });

        readStream.once('end', () => {
            console.log('done copying', src);
        });

        readStream.pipe(fs.createWriteStream(dest));
    }
}

module.exports = [emails, assets];