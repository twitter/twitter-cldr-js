// Copyright 2012 Twitter, Inc
// http://www.apache.org/licenses/LICENSE-2.0

var TwitterCldr = require('../../../lib/assets/javascripts/twitter_cldr/twitter_cldr.js');
var data = require('../../../lib/assets/javascripts/twitter_cldr/en.js');
TwitterCldr.set_data(data);

beforeEach(function() {
  var toMatchUnicodeRegexExactly = function(expected) {
    if (!(expected instanceof TwitterCldr.UnicodeRegex))
      return false;
    var match = this.actual.match(expected.to_regexp_str());
    return match !== null && this.actual === match[0];
  };
  this.addMatchers({
    toMatchUnicodeRegexExactly : toMatchUnicodeRegexExactly,
  });
});
describe("UnicodeRegex", function() {
  var compile = function (str, symbol_table) {
    return TwitterCldr.UnicodeRegex.compile(str, "", symbol_table);
  };
  var tokenizer = new TwitterCldr.UnicodeRegexTokenizer();
  var symbol_table = new TwitterCldr.SymbolTable({
    "$FOO" : tokenizer.tokenize("[g-k]"),
    "$BAR" : tokenizer.tokenize("[p-s]")
  });

  describe("basic operations", function() {
    var regex = compile("[abc]");

    describe("#compile", function() {
      it("should return a UnicodeRegex, parsed and ready to go", function() {
        expect(regex instanceof TwitterCldr.UnicodeRegex).toBe(true);
      });
    });

    describe("#to_regexp_str", function() {
      it("should return the string representation of this regex", function() {
        expect(regex.to_regexp_str()).toEqual("(?:[\\u0061-\\u0063])");
      });
    });

    describe("#to_regexp", function() {
      it("should return a Javascript Regexp", function() {
        expect(regex.to_regexp() instanceof RegExp).toBe(true);
      });

      it("should properly turn various basic regexes into strings", function() {
        expect(compile("^abc$").to_regexp_str()).toEqual("^(?:\\u0061)(?:\\u0062)(?:\\u0063)$");
        expect(compile("a(b)c").to_regexp_str()).toEqual("(?:\\u0061)((?:\\u0062))(?:\\u0063)");
        expect(compile("a(?:b)c").to_regexp_str()).toEqual("(?:\\u0061)(?:(?:\\u0062))(?:\\u0063)");
        expect(compile("a{1,3}").to_regexp_str()).toEqual("(?:\\u0061){1,3}");
        expect(compile("[abc]").to_regexp_str()).toEqual("(?:[\\u0061-\\u0063])");
      });

      it("should properly turn various complex regexes into strings", function() {
        expect(compile("[a-z0-9]").to_regexp_str()).toEqual("(?:[\\u0030-\\u0039]|[\\u0061-\\u007a])");
        expect(compile("[\\u0067-\\u0071]").to_regexp_str()).toEqual("(?:[\\u0067-\\u0071])");
      });

      it("should properly substitute variables", function() {
        expect(compile("$FOO$BAR", symbol_table).to_regexp_str()).toEqual("(?:[\\u0067-\\u006b])(?:[\\u0070-\\u0073])");
      });
    });
  });

  describe("with a few variables", function() {
    describe("#match", function() {
      it("should substitute variables from the symbol_table", function() {
        var regex = compile("$FOO $BAR", symbol_table);
        expect("h r").toMatchUnicodeRegexExactly(regex);
        expect("j q").toMatchUnicodeRegexExactly(regex);
        expect("h t").not.toMatchUnicodeRegexExactly(regex);
        expect("c s").not.toMatchUnicodeRegexExactly(regex);
      });
    });
  });
  describe("should match a regex with a capturing group", function() {
    describe("#match", function() {
      it("should match a regex with no char class", function() {
        var regex = compile("^abc$");
        expect("abc").toMatchUnicodeRegexExactly(regex);
        expect("cba").not.toMatchUnicodeRegexExactly(regex);
      });

      it("should match a regex with a capturing group", function() {
        var regex = compile("a(b)c");
        var match = regex.match("abc");
        expect(match).not.toBe(null);
        expect(match[1]).toEqual("b");
      });

      it("should match a regex with a non-capturing group", function() {
        var regex = compile("a(?:b)c");
        var match = regex.match("abc");
        expect(match).not.toBe(null);
        expect(match.length).toEqual(1);
      });

      it("should match a regex with a quantifier", function() {
        var regex = compile("a{1,3}");
        expect("a").toMatchUnicodeRegexExactly(regex);
        expect("aa").toMatchUnicodeRegexExactly(regex);
        expect("aaa").toMatchUnicodeRegexExactly(regex);
        expect("aaaa").not.toMatchUnicodeRegexExactly(regex);
        expect("b").not.toMatchUnicodeRegexExactly(regex);
      });

      it("should match a regex with a basic char class", function() {
        var regex = compile("[abc]");
        expect("a").toMatchUnicodeRegexExactly(regex);
        expect("b").toMatchUnicodeRegexExactly(regex);
        expect("c").toMatchUnicodeRegexExactly(regex);
        expect("ab").not.toMatchUnicodeRegexExactly(regex);
        expect("d").not.toMatchUnicodeRegexExactly(regex);
      });
    });
  });
  describe("matching complex character classes", function() {
    describe("#match", function() {
      it("should match a regex with a char class containing a range", function() {
        var regex = compile("[a-z0-9]");
        expect("a").toMatchUnicodeRegexExactly(regex);
        expect("m").toMatchUnicodeRegexExactly(regex);
        expect("z").toMatchUnicodeRegexExactly(regex);
        expect("0").toMatchUnicodeRegexExactly(regex);
        expect("3").toMatchUnicodeRegexExactly(regex);
        expect("9").toMatchUnicodeRegexExactly(regex);
        expect("a0").not.toMatchUnicodeRegexExactly(regex);
        expect("m4").not.toMatchUnicodeRegexExactly(regex);
      });

      it("should match a regex with a char class containing a unicode range", function() {
        var regex = compile("[\\u0067-\\u0071]"); // g-q;
        expect("g").toMatchUnicodeRegexExactly(regex);
        expect("q").toMatchUnicodeRegexExactly(regex);
        expect("h").toMatchUnicodeRegexExactly(regex);
        expect("z").not.toMatchUnicodeRegexExactly(regex);
      });

      it("should match a regex containing a character set", function() {
        var regex = compile("[\\p{Zs}]");
        expect(TwitterCldr.Utilities.pack_array([160])).toMatchUnicodeRegexExactly(regex);  // non-breaking space.toMatchUnicodeRegexExactly(regex);
        expect(TwitterCldr.Utilities.pack_array([5760])).toMatchUnicodeRegexExactly(regex);  // ogham space mark.toMatchUnicodeRegexExactly(regex);
        expect("a").not.toMatchUnicodeRegexExactly(regex);
      });

      it("should match a regex containing a negated character set", function() {
        var regex = compile("[\\P{Zs}]");
        expect("a").toMatchUnicodeRegexExactly(regex);
        expect(TwitterCldr.Utilities.pack_array([160])).not.toMatchUnicodeRegexExactly(regex);
        expect(TwitterCldr.Utilities.pack_array([5760])).not.toMatchUnicodeRegexExactly(regex);
      });

      it("should match a regex containing a character set (alternate syntax)", function() {
        var regex = compile("[[:Zs:]]");
        expect(TwitterCldr.Utilities.pack_array([160])).toMatchUnicodeRegexExactly(regex);  // non-breaking space.toMatchUnicodeRegexExactly(regex);
        expect(TwitterCldr.Utilities.pack_array([5760])).toMatchUnicodeRegexExactly(regex);  // ogham space mark.toMatchUnicodeRegexExactly(regex);
        expect("a").not.toMatchUnicodeRegexExactly(regex);
      });

      it("should match a regex containing a negated character set (alternate syntax)", function() {
        var regex = compile("[[:^Zs:]]");
        expect("a").toMatchUnicodeRegexExactly(regex);
        expect(TwitterCldr.Utilities.pack_array([160])).not.toMatchUnicodeRegexExactly(regex);
        expect(TwitterCldr.Utilities.pack_array([5760])).not.toMatchUnicodeRegexExactly(regex);
      });

      it("should match a regex with a character set and some quantifiers", function() {
        var regex = compile("[\\u0067-\\u0071]+");
        expect("gg").toMatchUnicodeRegexExactly(regex);
        expect("gh").toMatchUnicodeRegexExactly(regex);
        expect("qjk").toMatchUnicodeRegexExactly(regex);
        expect("").not.toMatchUnicodeRegexExactly(regex);
      });

      it("should match a regex that uses special switches inside the char class", function() {
        var regex = compile("[\\w]+");
        expect("a").toMatchUnicodeRegexExactly(regex);
        expect("abc").toMatchUnicodeRegexExactly(regex);
        expect("a0b_1c2").toMatchUnicodeRegexExactly(regex);
        expect("$@#").not.toMatchUnicodeRegexExactly(regex);
      });

      it("should match a regex that uses negated special switches inside the char class", function() {
        var regex = compile("[\\W]+");
        expect("a").not.toMatchUnicodeRegexExactly(regex);
        expect("abc").not.toMatchUnicodeRegexExactly(regex);
        expect("a0b_1c2").not.toMatchUnicodeRegexExactly(regex);
        expect("$@#").toMatchUnicodeRegexExactly(regex);
      });

      it("should match a regex with a complicated expression inside the char class", function() {
        // not [separators U space-tilde] diff [letters diff numbers]  (diff is commutative)
        var regex = compile("[^[\\p{Z}\\u0020-\\u007f]-[\\p{L}]-[\\p{N}]]");
        expect(" ").toMatchUnicodeRegexExactly(regex);
        expect(",").toMatchUnicodeRegexExactly(regex);
        expect("a").not.toMatchUnicodeRegexExactly(regex);
      });
    });
  });
});