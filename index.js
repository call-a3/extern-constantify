var transformTools = require('browserify-transform-tools');

module.exports = transformTools.makeFalafelTransform('extern-constantify', {jsFilesOnly: true}, 
	function(node, opts, done) {
		var name = node.source(), data = opts.configData.config, replacement;
		if (node.type === 'Identifier' && data.hasOwnProperty(name) && typeof data[name] !== 'undefined') {
			if (!isNaN(parseFloat(data[name])) && isFinite(data[name])) {
                replacement = '' + data[name];
            } else {
				replacement = '"' + data[name] + '"';
            }
			node.update(replacement);
		}
		done();
	});