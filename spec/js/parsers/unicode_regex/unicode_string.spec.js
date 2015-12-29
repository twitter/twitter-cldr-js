// Copyright 2012 Twitter, Inc
// http://www.apache.org/licenses/LICENSE-2.0

var TwitterCldr = require('../../../../lib/assets/javascripts/twitter_cldr/core.js');
var data = require('../../../../lib/assets/javascripts/twitter_cldr/en.js');

describe("Unicode String", function() {
  beforeEach(function() {
    TwitterCldr.set_data(data);
  });

  describe("#to_set", function() {
    it("should return a zero-length range when representing a single codepoint", function() {
      str = new TwitterCldr.UnicodeString([97]);
      expect (str.to_set().to_array()).toEqualRangeArray([new TwitterCldr.Range(97,97)]);
    });
    it("should return a range containing the codepoint array as both the first and last elements", function() {
      str = new TwitterCldr.UnicodeString([97,98,99]);
      expect (str.to_set().to_array()).toEqualRangeArray([new TwitterCldr.Range([97,98,99], [97,98,99])]);
    });
  });
});
