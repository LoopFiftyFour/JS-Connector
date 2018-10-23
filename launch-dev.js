const runAll = require("npm-run-all");
const forever = require("forever");

console.log("Starting dev environment");
setTimeout(function() {
    runAll(["watch"], {parallel: true, stdout: process.stdout})
        .then(() => {
            console.log("watching!");
        })
        .catch(err => {
            console.log("watch failed!", err);
        });
    },0)

setTimeout(function() {
    runAll(["server"], {parallel: true, stdout: process.stdout})
        .then(() => {
            console.log("server done!");
        })
        .catch(err => {
            console.log("server failed!", err);
        });
    },1000)
