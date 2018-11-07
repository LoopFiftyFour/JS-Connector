const runAll = require("npm-run-all");
const forever = require("forever");

const runopts = {parallel: true, stdout: process.stdout};

console.log("Running browserify");
runAll(["browserify"], runopts)
	.then(() => {console.log("Running uglify"); runAll(["uglify"], runopts)})
    .catch(console.error);