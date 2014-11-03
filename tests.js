var transformTools = require('browserify-transform-tools');
var test = require('tape');
var transform = require('./').configure({
	CONSTANT_ONE: 1,
	CONSTANT_TWO: "two"
});

test('specification test', function (t) {
    t.plan(5);
    
    t.equal(typeof transform, "function", 'transform should be a function');
    
    transformTools.runTransform(transform, 'dummy.js', {
		content: 'console.log(CONSTANT_ONE);'
		}, function (err, transformed) {
			t.equal(transformed, 'console.log(1);', 'Constant number should be replaced');
		});
    
    transformTools.runTransform(transform, 'dummy.js', {
		content: 'console.log(CONSTANT_TWO);'
		}, function (err, transformed) {
			t.equal(transformed, 'console.log("two");', 'String constants should be replaced with added quotes');
		});
    
    transformTools.runTransform(transform, 'dummy.js', {
		content: 'console.log("CONSTANT_ONE");'
		}, function (err, transformed) {
			t.equal(transformed, 'console.log("CONSTANT_ONE");', 'String that contains name of constant should not be replaced.');
		});
    
    transformTools.runTransform(transform, 'dummy.js', {
		content: 'console.log(Constant_TWO);'
		}, function (err, transformed) {
			t.equal(transformed, 'console.log(Constant_TWO);', 'Identifiers that don\'t exactly (case-sensitively) match the name of a constant should not be replaced.');
		});
});