// Copyright 2012 Twitter, Inc
// http://www.apache.org/licenses/LICENSE-2.0

var TwitterCldr = require('../../../../lib/assets/javascripts/twitter_cldr/core.js');
var data = require('../../../../lib/assets/javascripts/twitter_cldr/en.js');

describe("Character Set", function() {
  beforeEach(function() {
    TwitterCldr.set_data(data);
  });

  describe("#to_set", function() {
    it("should return a set containing codepoints for the given general property", function() {
      var char_set = new TwitterCldr.CharacterSet ("Zs");
      expect(char_set.to_set().to_array(true)).toEqualRangeArray([32, 160, 5760, 6158, new TwitterCldr.Range(8192,8202), 8239, 8287, 12288]);
    });
    it("should return a set containing codepoints for the given named property", function() {
      var char_set = new TwitterCldr.CharacterSet ("Sentence_Break=Sp");
      expect(char_set.to_set().to_array(true)).toEqualRangeArray([9, new TwitterCldr.Range(11,12), 32, 160, 5760, new TwitterCldr.Range(8192,8202), 8239, 8287, 12288]);
    });
  });
});
