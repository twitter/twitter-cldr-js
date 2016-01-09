// Copyright 2012 Twitter, Inc
// http://www.apache.org/licenses/LICENSE-2.0

var TwitterCldr = require('../../../lib/assets/javascripts/twitter_cldr/core.js');
var data = require('../../../lib/assets/javascripts/twitter_cldr/hi.js');

describe("DecimalFormatter", function() {
  var formatter;
  beforeEach(function() {
    TwitterCldr.set_data(data);
    formatter = new TwitterCldr.DecimalFormatter();
  });

  describe("#format", function() {
    it("should format positive decimals correctly", function() {
      expect(formatter.format(12.1)).toEqual("12.1");
    });

    it("should format negative decimals correctly", function() {
      expect(formatter.format(-12.1)).toEqual("-12.1");
    });

    it("should respect the precision option", function() {
      expect(formatter.format(-12, {precision: 3})).toEqual("-12.000");
    });

    it("should allow a precision of zero", function() {
      expect(formatter.format(12.3, {precision: 0})).toEqual("12");
    });

    it("should format short numbers correctly (with variable group size)", function() {
      expect(formatter.format(1)).toEqual("1");
      expect(formatter.format(10)).toEqual("10");
      expect(formatter.format(100)).toEqual("100");
      expect(formatter.format(1000)).toEqual("1,000");
    });

    it("should format big numbers correctly (with variable group size)", function() {
      expect(formatter.format(12345678)).toEqual("1,23,45,678");
    });
  });
});
