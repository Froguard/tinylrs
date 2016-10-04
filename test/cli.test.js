/*
 * test command line
 */
var assert = require("assert");
describe("test command line", function() {

    before(function() {
        // 在本区块的所有测试用例之前执行
    });

    after(function() {
        // 在本区块的所有测试用例之后执行
    });

    beforeEach(function() {
        // 在本区块的每个测试用例之前执行
    });

    afterEach(function() {
        // 在本区块的每个测试用例之后执行
    });

    it("test", function(done) {
        var n = 1;
        assert.ok(n);
        done && done.call(this);
    });

});
