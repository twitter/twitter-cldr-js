// Copyright 2012 Twitter, Inc
// http://www.apache.org/licenses/LICENSE-2.0

var TwitterCldr = require('../../../lib/assets/javascripts/twitter_cldr/en.js');

describe("UnicodeRegexParser", function() {
  var tokenizer = new TwitterCldr.UnicodeRegexTokenizer();
  var parser = new TwitterCldr.UnicodeRegexParser();
  var tokenize = function (text) {
    return tokenizer.tokenize(text);
  }
  var parse = function (text, options) {
    return parser.parse(text, options);
  }

  describe("#parse", function() {
    it("identifies ranges", function() {
      var elements = parse(tokenize("[a-z]"));
      expect(elements[0] instanceof TwitterCldr.CharacterClass).toBe(true);
      var root = elements[0].root;
      expect(root instanceof TwitterCldr.CharacterRange).toBe(true);
      expect(root.initial.codepoints).toEqual(TwitterCldr.Utilities.unpack_string("a"));
      expect(root.final.codepoints).toEqual(TwitterCldr.Utilities.unpack_string("z"));
    });
    it("replaces variables", function() {
      var symbol_table = new TwitterCldr.SymbolTable({"$VAR" : tokenize("\\p{L}")});
      var elements = parse(tokenize("($VAR)?"), {'symbol_table' : symbol_table});
      expect(elements[1] instanceof TwitterCldr.CharacterSet).toBe(true);
      expect(elements[1].property_value).toEqual("L");
    });
    it("handles character and negated character sets", function() {
      var elements = parse(tokenize("\\p{L}[:^P:]\\P{L}[:P:]"));

      var element = elements[0];
      expect(element instanceof TwitterCldr.CharacterSet).toBe(true);
      expect(element.property_value).toEqual("L");

      element = elements[1];
      expect(element instanceof TwitterCldr.CharacterClass).toBe(true);
      expect(element.root.child.property_value).toEqual("P");
      expect(element.root.operator).toEqual("negate");

      element = elements[2];
      expect(element instanceof TwitterCldr.CharacterClass).toBe(true);
      expect(element.root.child.property_value).toEqual("L");      

      element = elements[3];
      expect(element instanceof TwitterCldr.CharacterSet).toBe(true);
      expect(element.property_value).toEqual("P");
    });
    it("handles unicode characters", function() {
      var elements = parse(tokenize("\\u0123"));
      expect(elements[0] instanceof TwitterCldr.UnicodeString).toBe(true);
      expect(elements[0].codepoints).toEqual([291]);
    });
    it("handles multichar and escaped unicode strings", function() {
      var elements = parse(tokenize("\\g{abc}"));
      expect(elements[0] instanceof TwitterCldr.Literal).toBe(true);
      expect(elements[0].text).toEqual("\\g");
      expect(elements[1] instanceof TwitterCldr.UnicodeString).toBe(true);
      expect(elements[1].codepoints).toEqual([97, 98, 99]);
    });
    it("handles special chars", function() {
      var elements = parse(tokenize("^(?:)$"));
      for (var i = 0; i < elements.length; i ++) {
        expect(elements[i] instanceof TwitterCldr.Literal).toBe(true);
      }
      expect(elements[0].text).toEqual("^");
      expect(elements[1].text).toEqual("(");
      expect(elements[2].text).toEqual("?");
      expect(elements[3].text).toEqual(":");
      expect(elements[4].text).toEqual(")");
      expect(elements[5].text).toEqual("$");
    });
  });
});