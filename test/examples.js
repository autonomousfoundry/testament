var test = require("../lib/testament").test;
var assert = require("assert");


test("Basic", function() {

  assert.equal(true, true);

  test("Basic Nested", function() {
    assert.equal(true, true);
  });

  test("Asynchrounous sequence", step1, step2);

});

function step1(done) {
    process.nextTick(function(){ 
        someVar = 42;
        done();
    });
    someVar = 100;
}

function step2() {
    assert.equal(someVar, 42);
}
