// Copyright 2012 Twitter, Inc
// http://www.apache.org/licenses/LICENSE-2.0

var TwitterCldr = require('../../../../lib/assets/javascripts/twitter_cldr/twitter_cldr.js');
var data = require('../../../../lib/assets/javascripts/twitter_cldr/en.js');

describe("Character Class", function() {
  TwitterCldr.set_data(data);
  var tokenizer = new TwitterCldr.UnicodeRegexTokenizer();
  var parser = new TwitterCldr.UnicodeRegexParser();
  var tokenize = function (text) {
    return tokenizer.tokenize(text);
  }
  var parse = function (text, options) {
    return parser.parse(text, options);
  }
  var char_class_from = function (elements) {
    return elements[0];
  }
  describe("#to_set", function() {
    it("unions together char classes with no explicit operator", function() {
      var char_class = char_class_from(parse(tokenize("[[a][b]]")));
      expect(char_class.to_set()).toEqualRangeSet(new TwitterCldr.RangeSet([new TwitterCldr.Range(97, 98)]));
    });
    it("unions together other entities within char classes when operator is not explicit", function() {
      var char_class = char_class_from(parse(tokenize("[a-z0-9\\u0123]")));
      expect(char_class.to_set()).toEqualRangeSet(new TwitterCldr.RangeSet([new TwitterCldr.Range(48, 57), new TwitterCldr.Range(97, 122), new TwitterCldr.Range(291, 291)]));
    });
    it("intersects correctly", function() {
      var char_class = char_class_from(parse(tokenize("[[a-m]&[g-z]]")));
      expect(char_class.to_set()).toEqualRangeSet(new TwitterCldr.RangeSet([new TwitterCldr.Range(103, 109)]));
    });
    it("finds symmetric differences correctly", function() {
      var char_class = char_class_from(parse(tokenize("[[a-m]-[g-z]]")));
      expect(char_class.to_set()).toEqualRangeSet(new TwitterCldr.RangeSet([new TwitterCldr.Range(97, 102), new TwitterCldr.Range(110, 122)]));
    });
    it("computes sets for nested expressions", function() {
      // (97..109) U (104..106)
      // = (104..106)
      // ((104..106) U (107..122)) subtr ((104..106) C (107..122))
      // = (104..122) subtr ()
      // = (104..122)
      var char_class = char_class_from(parse(tokenize("[[[a-m]&[h-j]]-[k-z]]")));
      expect(char_class.to_set()).toEqualRangeSet(new TwitterCldr.RangeSet([new TwitterCldr.Range(104, 122)]));
    });
    it("pulls in ranges for unicode character sets", function() {
      var char_class = char_class_from(parse(tokenize("[\\p{Zs}]")));
      expect(char_class.to_set()).toEqualRangeSet(new TwitterCldr.RangeSet([
        new TwitterCldr.Range(32, 32),
        new TwitterCldr.Range(160, 160),
        new TwitterCldr.Range(5760, 5760),
        new TwitterCldr.Range(6158, 6158),
        new TwitterCldr.Range(8192, 8202),
        new TwitterCldr.Range(8239, 8239),
        new TwitterCldr.Range(8287, 8287),
        new TwitterCldr.Range(12288, 12288)
      ]));
    });
    it("computes unions between unicode character sets", function() {
      var char_class = char_class_from(parse(tokenize("[[\\p{Zs}][\\p{Cc}]]")));
      expect(char_class.to_set()).toEqualRangeSet(new TwitterCldr.RangeSet([
        new TwitterCldr.Range(0, 1),
        new TwitterCldr.Range(8, 32),
        new TwitterCldr.Range(127, 160),
        new TwitterCldr.Range(5760, 5760),
        new TwitterCldr.Range(6158, 6158),
        new TwitterCldr.Range(8192, 8202),
        new TwitterCldr.Range(8239, 8239),
        new TwitterCldr.Range(8287, 8287),
        new TwitterCldr.Range(12288, 12288)
      ]));
    });
    it("computes intersections between unicode character sets", function() {
      var char_class = char_class_from(parse(tokenize("[[\\p{Zs}]&[\\u2000-\\u202B]]")));
      expect(char_class.to_set()).toEqualRangeSet(new TwitterCldr.RangeSet([new TwitterCldr.Range(8192, 8202)]));
    });
    it("supports negating character sets", function() {
      var char_class = char_class_from(parse(tokenize("[^\\u2000-\\u202B]")));
      expect(char_class.to_set()).toEqualRangeSet(new TwitterCldr.RangeSet([
        new TwitterCldr.Range(0, 1),
        new TwitterCldr.Range(8, 8191),
        new TwitterCldr.Range(8236, 55295),
        new TwitterCldr.Range(57344, 65535), //1114111),
      ]));
    });
    it("supports literal and excaped characters", function() {
      var char_class = char_class_from(parse(tokenize("[abc\\edf\\g]")));
      expect(char_class.to_set()).toEqualRangeSet(new TwitterCldr.RangeSet([new TwitterCldr.Range(97, 103)]));
    });
    it("supports special switch characters", function() {
      var char_class = char_class_from(parse(tokenize("[\\w]"))); // a-z, A-Z, 0-9, _
      expect(char_class.to_set()).toEqualRangeSet(new TwitterCldr.RangeSet([
        new TwitterCldr.Range(48, 57),
        new TwitterCldr.Range(65, 90),
        new TwitterCldr.Range(95, 95),
        new TwitterCldr.Range(97, 122),
      ]));
    });
    it("supports negated switch characters", function() {
      char_class = char_class_from(parse(tokenize("[\\D]")))  // i.e. NOT \d
      expect(char_class.to_set()).toEqualRangeSet(new TwitterCldr.RangeSet([
        new TwitterCldr.Range(0, 1),
        new TwitterCldr.Range(8, 47),
        new TwitterCldr.Range(58, 55295),
        new TwitterCldr.Range(57344, 65535), //1114111),
      ]));
    });
  });
  describe("#to_regexp_str", function() {
    it("wraps ranges in square brackets", function() {
      var char_class = char_class_from(parse(tokenize("[a-z]")));
      expect(char_class.to_regexp_str()).toEqual("(?:[\\u0061-\\u007a])");
    });
    it("hex-encodes and wraps sequential characters to isolate bytes", function() {
      var char_class = char_class_from(parse(tokenize("[{foo}]")));
      expect(char_class.to_regexp_str()).toEqual("(?:(?:\\u0066)(?:\\u006f)(?:\\u006f))");
    });
    it("combines multiple components with 'or' pipe characters", function() {
      var char_class = char_class_from(parse(tokenize("[{foo}abc]")));
      expect(char_class.to_regexp_str()).toEqual("(?:(?:\\u0066)(?:\\u006f)(?:\\u006f)|[\\u0061-\\u0063])");
    });
  });
});