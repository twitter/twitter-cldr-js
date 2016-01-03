// Copyright 2012 Twitter, Inc
// http://www.apache.org/licenses/LICENSE-2.0

var TwitterCldr = require('../../../../lib/assets/javascripts/twitter_cldr/core.js');
var data = require('../../../../lib/assets/javascripts/twitter_cldr/ru.js');

describe("LongDecimalFormatter", function() {
  var formatter;
  beforeEach(function() {
    TwitterCldr.set_data(data);
    formatter = new TwitterCldr.LongDecimalFormatter();
  });

  describe("#format", function() {
    it("uses correct pluralization for abbreviated numbers", function() {
      expect(formatter.format(1000)).toEqual("1 тысяча");
      expect(formatter.format(2222)).toEqual("2 тысячи");
      expect(formatter.format(5000)).toEqual("5 тысяч");

      expect(formatter.format(1200000, { precision: 0 })).toEqual("1 миллион");
      expect(formatter.format(1200000, { precision: 1 })).toEqual("1,2 миллиона");

      expect(formatter.format(3000000)).toEqual("3 миллиона");
      expect(formatter.format(3456000, { precision: 2 })).toEqual("3,46 миллиона");
    });
  });
});
