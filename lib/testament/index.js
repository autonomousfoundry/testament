exports.test = function() {
    var testFunctions = Array.prototype.slice.call(arguments);
    var testName = "untitled";
    if(typeof testFunctions[0] === "string") testFunctions.shift();
    runTestSequence(testFunctions);
};

function runTestSequence(sequence) {
    var firstTest = sequence.shift();
    if(sequence.length===0) {
        firstTest();
    } else {
        var lock = addAsyncLock();
        function done() {
            lock.release();
            runTestSequence(sequence);
        }
        firstTest(done);
    }
}

var anyException = false;
var exiting = false;
var asyncLockList = [];

function addAsyncLock() {
    var lock = {
        released: false,
        release: function(){ lock.released = true; }
    };
    asyncLockList.push(lock);
    return lock;
}

process.on("exit", function() {
    exiting = true;
    for(var i=0; i<asyncLockList.length; i++) {
        if(!asyncLockList[i].released) handleException(new Error("Asynchronous target never reached"));
    }
    if(!anyException) result({success:true});
});

process.on("uncaughtException", handleException);

function handleException(e) {
    result({success:false, error: e});
    anyException = true;
    if(!exiting) process.exit();
}

function result(data) {
    console.log(JSON.stringify(data));
}
