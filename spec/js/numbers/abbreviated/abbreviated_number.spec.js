// Copyright 2012 Twitter, Inc
// http://www.apache.org/licenses/LICENSE-2.0

var TwitterCldr = require('../../../../lib/assets/javascripts/twitter_cldr/twitter_cldr.js');
var data = require('../../../../lib/assets/javascripts/twitter_cldr/en.js');

describe("AbbreviatedNumberFormatter", function() {
  beforeEach(function() {
    TwitterCldr.set_data(data);
    formatter = new TwitterCldr.AbbreviatedNumberFormatter();
    number = 1234;
  });

  describe("#transform_number", function() {
    it("truncates the number based on the integer format string", function() {
      expect(formatter.truncate_number(number, 1)).toEqual(1.234);
      expect(formatter.truncate_number(number, 2)).toEqual(12.34);
      expect(formatter.truncate_number(number, 3)).toEqual(123.4);
      expect(formatter.truncate_number(number, 4)).toEqual(1234);
      expect(formatter.truncate_number(number, 5)).toEqual(1234);
    });

    it("returns the original number if greater than 10^15", function() {
      expect(formatter.truncate_number(Math.pow(10, 15), "000")).toEqual(Math.pow(10, 15));
    });

    it("returns the original number if less than 10^3", function() {
      expect(formatter.truncate_number(999, "000")).toEqual(999);
    });
  });

  describe("#get_key", function() {
    it("builds a power-of-ten key based on the number of digits in the input", function() {
      for(var i = 3; i < 15; i ++) {
        var zeroes = "";
        for(var j = 0; j < (i - 3); j ++) {
          zeroes += "0";
        }
        expect(formatter.get_key(parseInt("1337" + zeroes))).toEqual(Math.pow(10, i).toString());
      }
    });
  });
});