// Copyright 2012 Twitter, Inc
// http://www.apache.org/licenses/LICENSE-2.0

var TwitterCldr = require('../../../../lib/assets/javascripts/twitter_cldr/twitter_cldr.js');

describe("Literal", function() {
  describe("#to_set", function() {
    it("should set an array of tokens", function() {
      literal = new TwitterCldr.Literal ("a");
      expect(literal.to_set().to_array(true)).toEqual([97]);
    });
    it("should return escaped characters with no special meaning as codepoints", function() {
      literal = new TwitterCldr.Literal ("\\a");
      expect(literal.to_set().to_array(true)).toEqual([97]);
    });
    it("should convert special regex switches to their range equivalents", function() {
      literal = new TwitterCldr.Literal ("\\d"); // digit
      expect(literal.to_set()).toEqualRangeSet(new TwitterCldr.RangeSet([new TwitterCldr.Range(48,57)]));
    });
    it("should convert negated special regex switches to their range equivalents", function() {
      literal = new TwitterCldr.Literal ("\\D"); // NOT digit
      expect(literal.to_set()).toEqualRangeSet(new TwitterCldr.RangeSet([
        new TwitterCldr.Range(0, 1),
        new TwitterCldr.Range(8, 47),
        new TwitterCldr.Range(58, 55295),
        new TwitterCldr.Range(57344, 65535),//1114111),
      ]));
    });
  });
});
