// Copyright 2012 Twitter, Inc
// http://www.apache.org/licenses/LICENSE-2.0


describe("DateTimeFormatter", function() {
  beforeEach(function() {
		TwitterCldr = require('../../../lib/assets/javascripts/twitter_cldr/twitter_cldr.js');
    eval(require('fs').readFileSync('lib/assets/javascripts/twitter_cldr/ru.js', 'utf8'));
    formatter = new TwitterCldr.DateTimeFormatter();
  });

  describe("#format", function() {
    it("correctly formats Russian additional formats", function() {
      date = new Date(2012, 1, 1);
      expect(formatter.format(date, {format: "additional", type: "GyMMMd"})).toEqual("1 февр. 2012 г. н. э.");
    });
  });
});
