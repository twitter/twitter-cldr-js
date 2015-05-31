// Copyright 2012 Twitter, Inc
// http://www.apache.org/licenses/LICENSE-2.0

var TwitterCldr = require('../../../lib/assets/javascripts/twitter_cldr/twitter_cldr.js');
var data = require('../../../lib/assets/javascripts/twitter_cldr/ru.js');

describe("TimespanFormatter", function() {
  beforeEach(function() {
    TwitterCldr.set_data(data);
    formatter = new TwitterCldr.TimespanFormatter();
  });
  describe("#format", function() {
    it("works for Russian", function() {
      var options = {direction: "none", approximate: true};
      expect(formatter.format(1, options)).toEqual("1 секунда");
      expect(formatter.format(2, options)).toEqual("2 секунды");
      expect(formatter.format(5, options)).toEqual("5 секунд");
      expect(formatter.format(23, options)).toEqual("23 секунды");
    });
  });
});
