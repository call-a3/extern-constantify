'use strict';

var through = require('through2');
var esprima = require('esprima');
module.exports = function(file, opts) {
    var buffer = '';

    return through(transform, flush);

    function transform(chunk, enc, cb) {
        buffer += chunk;
        cb();
    }

    function flush(cb) {
        var tokens, deltas, tok, name, replacement, lineIdx, line, delta;
        tokens = esprima.tokenize(buffer, {
            loc: true
        });
        buffer = buffer.split('\n');
        deltas = new Array(buffer.length);
      for (var i=0,l=deltas.length;i<l;i++){deltas[i]=0;}

        for (var i = 0, l = tokens.length; i < l; i++) {
            tok = tokens[i];
            console.log('[constantify]', tok);
            if (tok.type === 'Identifier') {
                name = tok.value;
                if (opts.hasOwnProperty(name) && typeof opts[name] !== 'undefined') {
                    if (!isNaN(parseFloat(opts[name])) && isFinite(opts[name])) {
                        replacement = '' + opts[name];
                    } else {
                        replacement = '"' + opts[name] + '"';
                    }
                    if (tok.loc.start.line === tok.loc.end.line) {
                        lineIdx = tok.loc.start.line-1;
                        line = buffer[lineIdx];
                        delta = deltas[lineIdx];
                      console.log(line);
                        buffer[lineIdx] = line.substring(0 + delta, tok.loc.start.column + delta) + replacement + line.substring(tok.loc.end.column + delta);
                        deltas[lineIdx] = replacement.length - tok.value.length + delta;
                    } else {
                        this.emit('error', new Error('An identifier should not be split across more than one line'));
                    }
                }
            }
        }

        this.push(buffer.join('\n'));
        cb();
    }
};