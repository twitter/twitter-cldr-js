// Copyright 2012 Twitter, Inc
// http://www.apache.org/licenses/LICENSE-2.0

var TwitterCldr = require('../../../lib/assets/javascripts/twitter_cldr/twitter_cldr.js');
var data = require('../../../lib/assets/javascripts/twitter_cldr/en.js');

describe("SegmentationParser", function() {
  TwitterCldr.set_data(data);
  var tokenizer = new TwitterCldr.SegmentationTokenizer();
  var parser = new TwitterCldr.SegmentationParser();
  var tokenize = function (text) {
    return tokenizer.tokenize(text);
  }
  var parse = function (text, options) {
    return parser.parse(text, options);
  }
  var symbol_table = new TwitterCldr.SymbolTable({"$FOO" : tokenize("[abc]")});
  describe("#parse", function() {
    it("should parse a rule with a break", function() {
      var rule = parse(tokenize("[a-z] ÷ [0-9]"));
      expect(rule.left.to_regexp_str()).toEqual("^(?:[\\u0061-\\u007a])");
      expect(rule.right.to_regexp_str()).toEqual("^(?:[\\u0030-\\u0039])");
      expect(rule.boundary_symbol).toEqual("break");
    });
    it("should parse a rule with a non-break", function() {
      var rule = parse(tokenize("[a-z] × [0-9]"));
      expect(rule.regex.to_regexp_str()).toEqual("^(?:[\\u0061-\\u007a])(?:[\\u0030-\\u0039])");
      expect(rule.boundary_symbol).toEqual("no_break");
    });
    it("should parse a rule containing a variable", function() {
      var rule = parse(tokenize("$FOO × bar"), {'symbol_table' : symbol_table});
      expect(rule.regex.to_regexp_str()).toEqual("^(?:[\\u0061-\\u0063])(?:\\u0062)(?:\\u0061)(?:\\u0072)");
      expect(rule.boundary_symbol).toEqual("no_break");
    });
  });
  describe("SegmentationParser.BreakRule", function() {
    var rule = parse(tokenize("[a-z] ÷ [0-9]"));
    it("rule should be the right type", function() {
      expect(rule instanceof TwitterCldr.SegmentationParser.BreakRule)
    });
    it("should match and return the right offset and text", function() {
      var match = rule.match("c7");
      expect(match.boundary_offset).toEqual(1);
      expect(match.text).toEqual("c7");
    });
    it("should not match if the input string doesn't contain a matching right- and/or left-hand side", function() {
      expect(rule.match("C7")).toBe(null);
      expect(rule.match("cc")).toBe(null);
      expect(rule.match("CC")).toBe(null);
    });
  });
  describe("SegmentationParser.NoBreakRule", function() {
    var rule = parse(tokenize("[a-z] × [0-9]"));
    it("rule should be the right type", function() {
      expect(rule instanceof TwitterCldr.SegmentationParser.NoBreakRule)
    });
    it("should match and returh the right offset and text", function() {
      var match = rule.match("c7");
      //non-break rules send you to the end of the match (maybe that's wrong?)
      expect(match.boundary_offset).toEqual(2)
      expect(match.text).toEqual("c7")
    });
    it("should not match if the input string doesn't contain matching text", function() {
      expect(rule.match("C7")).toBe(null);
      expect(rule.match("cc")).toBe(null);
      expect(rule.match("CC")).toBe(null);
    });
  });
});