// Copyright 2012 Twitter, Inc
// http://www.apache.org/licenses/LICENSE-2.0

var TwitterCldr = require('../../../../lib/assets/javascripts/twitter_cldr/core.js');
var data = require('../../../../lib/assets/javascripts/twitter_cldr/en.js');

describe("Character Range", function() {
  beforeEach(function() {
    TwitterCldr.set_data(data);
  });

  describe("#to_set", function() {
    it("should return a range between the initial and the final values", function() {
      range = new TwitterCldr.CharacterRange (
        new TwitterCldr.UnicodeString([97]),
        new TwitterCldr.UnicodeString([98])
      );

      expect (range.to_set().to_array(true)).toEqualRangeArray([new TwitterCldr.Range(97,98)]);
    });
  });
});
