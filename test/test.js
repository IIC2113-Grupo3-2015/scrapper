


var assert = require('assert');
describe('Scrapper', function() {
	var _this = this;
	it('should be able to start', function (done) {
		_this.scrapper = require('../build/app.js');
		done()
	});
	it('should be able to stop', function (done) {
		_this.scrapper.stop();
		done()
	});
});