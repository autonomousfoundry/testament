var path = require("path"), sys = require("sys"), fs = require("fs"), exec = require("child_process").exec;
var _ = require("underscore");

function forEachFile(dir, callback) {
    _(listAllFiles(dir)).each(function(f){ callback(f); });
}

function listAllFiles(dir) {
    var allFiles = [];
    _(fs.readdirSync(dir)).each(function(file) {
        file = path.join(dir, file);
        allFiles.push(isDir(file) ? listAllFiles(file) : file);
    });
    return _.uniq(_.flatten(allFiles));
}

function isDir(path) {
    try {
        return fs.statSync(path).isDirectory();
    } catch(e) {}
}

function runSuiteOnUpdate(f) {
    try {
        fs.watchFile(f, runSuite);
    } catch(e) {}
}

function isRunnable(file) {
    return (file.match(/\.js$/) && !file.match(/\/\.#/))? true : false
}

var ansi = {
    clearScreen: function() {
        return "\033[2J\033[H";
    },
    color: function(colorCode, text) {
        return "\033[" + colorCode + "m" + text + "\033[0m";
    },
    successColor: function(text) {
        return ansi.color("1;32", text);
    },
    errorColor: function(text) {
        return ansi.color("1;31", text);
    },
    neutralColor: function(text) {
        return ansi.color("0;38", text);
    }
};
        
function testResult(data) {
    try {
        return JSON.parse(data);
    } catch(e) {
        message = "Couldn't parse text execution result: "+data;
        return {success:false, error:new Error(message)};
    }
}

var startTime;

function runSuite() {
    startTime = new Date();
    if(!isDir("test")) {
        console.log("Error: no 'test' directory found.");
        process.exit();
    }
    var fileList = listAllFiles("test");
    fileList = _(fileList).select(isRunnable);
    runNextTest(fileList);
}

function formatError(error) {
    return error.stack;
}

function runNextTest(fileList) {
    var testFile = fileList.shift();
    exec("node "+testFile, function(error, stdout, stderr) {
        var result = testResult(stdout);
        if(result && !result.success) {
            console.log(ansi.errorColor("Error: " + formatError(result.error)));
        } else if(fileList.length === 0) {
            var endTime = new Date();
            var elapsed = endTime - startTime;
            console.log(ansi.successColor("All tests passed. (" + elapsed + "ms)"));
        } else {
            runNextTest(fileList);
        }
    });
}

exports.start = function() {
    forEachFile(".", runSuiteOnUpdate);
    runSuite();
}