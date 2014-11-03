extern-constantify
==================

[![Build Status](https://travis-ci.org/call-a3/extern-constantify.svg?branch=master)](https://travis-ci.org/call-a3/extern-constantify)
[![Dependency Status](https://david-dm.org/call-a3/extern-constantify.svg)](https://david-dm.org/call-a3/extern-constantify) [![devDependency Status](https://david-dm.org/call-a3/extern-constantify/dev-status.svg)](https://david-dm.org/call-a3/extern-constantify#info=devDependencies)

Browserify transform that allows does in-place replacement of global constants, without having to declare them or import them at every occurence.

## Installation

[![extern-constantify](https://nodei.co/npm/extern-constantify.png?mini=true)](https://nodei.co/npm/extern-constantify)

## Usage

``` bash
browserify -t extern-constantify entry.js > bundle.js
```

## Example

For example, suppose you have different classes/objects in your project communicating by events/messages:

``` javascript
var Sender = function () {
	this.emit('begin');
	//do some stuff, reporting progress
	this.emit('busy', progress);
	//finalize and report success
	this.emit('done');
};

var Receiver = function (sender) {
	sender.on('begin', function(data) {
		node.innerHTML = 'Starting...';
	});
	sender.on('busy', function(data) {
		node.innerHTML = 'Work is ' + data + '% complete';
	});
	sender.on('done', function(data) {
		node.innerHTML = 'Work is done';
	});
};
```

Now suppose you later decide to change the names of these events to `start`, `progress` and `end`. You would have to look for the various occurences of the original literal strings in your code and replace them accordingly. This introduces a lot of room for error. Instead you could write this:

``` javascript
var Sender = function () {
	this.emit(BEGIN_EVENT);
	//do some stuff, reporting progress
	this.emit(BUSY_EVENT, progress);
	//finalize and report success
	this.emit(END_EVENT);
};

var Receiver = function (sender) {
	sender.on(BEGIN_EVENT, function(data) {
		node.innerHTML = 'Starting...';
	});
	sender.on(BUSY_EVENT, function(data) {
		node.innerHTML = 'Work is ' + data + '% complete';
	});
	sender.on(END_EVENT, function(data) {
		node.innerHTML = 'Work is done';
	});
};
```
and provide the following configuration in your `package.json` file

``` javascript
{
  "extern-constantify": {
	"BEGIN_EVENT": "begin",
	"BUSY_EVENT": "busy",
	"END_EVENT": "done"
  }
}
```

The aforementioned change would then only require one edit in your configuration instead of the multiple edits that were previously required.

The matching happens case-sensitively, so you can avoid naming conflicts by uppercasing all characters of a constant name. This is the recommended coding style, however it is not mandatory.

## License
[MIT](http://github.com/call-a3/extern-constantify/blob/master/LICENSE)