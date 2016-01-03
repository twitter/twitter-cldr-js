// Copyright 2012 Twitter, Inc
// http://www.apache.org/licenses/LICENSE-2.0

var TwitterCldr = require('../../../../lib/assets/javascripts/twitter_cldr/core.js');
var data = require('../../../../lib/assets/javascripts/twitter_cldr/en.js');
TwitterCldr.set_data(data);

beforeEach(function() {
  var toEqualTokenList = function (expected) {
    if (!(this.actual instanceof Array) || !(expected instanceof Array))
      return false;
    if (this.actual.length !== expected.length)
      return false;
    for (var i = 0; i < this.actual.length; i++) {
      var hash = expected[i];
      for (var key in hash)
      {
        if (expected[i][key] !== this.actual[i][key])
          return false;
      }
    }
    return true;
  };
  this.addMatchers({
    toEqualTokenList : toEqualTokenList
  });
});

describe("UnicodeRegexTokenizer", function() {
  var tokenizer = new TwitterCldr.UnicodeRegexTokenizer();
  it("should tokenize a regular regex", function() {
    expect(tokenizer.tokenize("^(ab)xy$")).toEqualTokenList([
      { 'value' : "^", 'type' : "negate" },
      { 'value' : "(", 'type' : "special_char" },
      { 'value' : "a", 'type' : "string" },
      { 'value' : "b", 'type' : "string" },
      { 'value' : ")", 'type' : "special_char" },
      { 'value' : "x", 'type' : "string" },
      { 'value' : "y", 'type' : "string" },
      { 'value' : "$", 'type' : "special_char" }
    ]);
  });
  it("should tokenize a regex containing a basic character class", function() {
    expect(tokenizer.tokenize("a[bc]d")).toEqualTokenList([
      { 'value' : "a", 'type' : "string" },
      { 'value' : "[", 'type' : "open_bracket" },
      { 'value' : "b", 'type' : "string" },
      { 'value' : "c", 'type' : "string" },
      { 'value' : "]", 'type' : "close_bracket" },
      { 'value' : "d", 'type' : "string" }
    ]);
  });
  it("should tokenize a regex containing unicode character sets", function() {
    expect(tokenizer.tokenize("\\p{Zs}[:Lu:]")).toEqualTokenList([
      { 'value' : "\\p{Zs}", 'type' : "character_set" },
      { 'value' : "[:Lu:]",  'type' : "character_set" }
    ]);
  });
  it("should tokenize a regex containing escaped characters", function() {
    expect(tokenizer.tokenize("^[a\\b]\\$")).toEqualTokenList([
      { 'value' : "^", 'type' : "negate" },
      { 'value' : "[", 'type' : "open_bracket" },
      { 'value' : "a", 'type' : "string" },
      { 'value' : "\\b", 'type' : "escaped_character" },
      { 'value' : "]", 'type' : "close_bracket" },
      { 'value' : "\\$", 'type' : "escaped_character" }
    ]);
  });
  it("should tokenize a regex containing basic character ranges", function() {
    expect(tokenizer.tokenize("[a-z0-9]|[ab]")).toEqualTokenList([
      { 'value' : "[", 'type' : "open_bracket" },
      { 'value' : "a", 'type' : "string" },
      { 'value' : "-", 'type' : "dash" },
      { 'value' : "z", 'type' : "string" },
      { 'value' : "0", 'type' : "string" },
      { 'value' : "-", 'type' : "dash" },
      { 'value' : "9", 'type' : "string" },
      { 'value' : "]", 'type' : "close_bracket" },
      { 'value' : "|", 'type' : "pipe" },
      { 'value' : "[", 'type' : "open_bracket" },
      { 'value' : "a", 'type' : "string" },
      { 'value' : "b", 'type' : "string" },
      { 'value' : "]", 'type' : "close_bracket" },
    ]);
  });
  it("should tokenize a regex containing escaped unicode characters", function() {
    expect(tokenizer.tokenize("\\u0020[\\u0123-\\u0155]")).toEqualTokenList([
      { 'value' : "\\u0020", 'type' : "unicode_char" },
      { 'value' : "[", 'type' : "open_bracket" },
      { 'value' : "\\u0123", 'type' : "unicode_char" },
      { 'value' : "-", 'type' : "dash" },
      { 'value' : "\\u0155", 'type' : "unicode_char" },
      { 'value' : "]", 'type' : "close_bracket" },
    ]);
  });
  it("should tokenize a regex containing variable substitutions", function() {
    expect(tokenizer.tokenize("$CR(?:ab)[$LF]")).toEqualTokenList([
      { 'value' : "$CR", 'type' : "variable" },
      { 'value' : "(", 'type' : "special_char" },
      { 'value' : "?", 'type' : "special_char" },
      { 'value' : ":", 'type' : "special_char" },
      { 'value' : "a", 'type' : "string" },
      { 'value' : "b", 'type' : "string" },
      { 'value' : ")", 'type' : "special_char" },
      { 'value' : "[", 'type' : "open_bracket" },
      { 'value' : "$LF", 'type' : "variable" },
      { 'value' : "]", 'type' : "close_bracket" }
    ]);
  });
  it("should tokenize a regex containing multichar strings", function() {
    expect(tokenizer.tokenize("[{foo}bar]")).toEqualTokenList([
      { 'value' : "[", 'type' : "open_bracket" },
      { 'value' : "{foo}", 'type' : "multichar_string" },
      { 'value' : "b", 'type' : "string" },
      { 'value' : "a", 'type' : "string" },
      { 'value' : "r", 'type' : "string" },
      { 'value' : "]", 'type' : "close_bracket" }
    ]);
  });
  it("should tokenize a regex containing negated character sets", function() {
    expect(tokenizer.tokenize("[[:^N:]\\P{L}]")).toEqualTokenList([
      { 'value' : "[", 'type' : "open_bracket" },
      { 'value' : "[:^N:]", 'type' : "negated_character_set" },
      { 'value' : "\\P{L}", 'type' : "negated_character_set" },
      { 'value' : "]", 'type' : "close_bracket" }
    ]);
  });
  it("should tokenize a regex containing some of everything", function() {
    expect(tokenizer.tokenize("^[a-zb]?[^[\\p{Z}\\u0020-\\u007f]-[\\P{L}]-[[:N:]\\u0123]][:^CC:]*[{foo}]+$")).toEqualTokenList([
      { 'value' : "^", 'type' : "negate" },
      { 'value' : "[", 'type' : "open_bracket" },
      { 'value' : "a", 'type' : "string" },
      { 'value' : "-", 'type' : "dash" },
      { 'value' : "z", 'type' : "string" },
      { 'value' : "b", 'type' : "string" },
      { 'value' : "]", 'type' : "close_bracket" },
      { 'value' : "?", 'type' : "special_char" },
      { 'value' : "[", 'type' : "open_bracket" },
      { 'value' : "^", 'type' : "negate" },
      { 'value' : "[", 'type' : "open_bracket" },
      { 'value' : "\\p{Z}", 'type' : "character_set" },
      { 'value' : "\\u0020", 'type' : "unicode_char" },
      { 'value' : "-", 'type' : "dash" },
      { 'value' : "\\u007f", 'type' : "unicode_char" },
      { 'value' : "]", 'type' : "close_bracket" },
      { 'value' : "-", 'type' : "dash" },
      { 'value' : "[", 'type' : "open_bracket" },
      { 'value' : "\\P{L}", 'type' : "negated_character_set" },
      { 'value' : "]", 'type' : "close_bracket" },
      { 'value' : "-", 'type' : "dash" },
      { 'value' : "[", 'type' : "open_bracket" },
      { 'value' : "[:N:]", 'type' : "character_set" },
      { 'value' : "\\u0123", 'type' : "unicode_char" },
      { 'value' : "]", 'type' : "close_bracket" },
      { 'value' : "]", 'type' : "close_bracket" },
      { 'value' : "[:^CC:]", 'type' : "negated_character_set" },
      { 'value' : "*", 'type' : "special_char" },
      { 'value' : "[", 'type' : "open_bracket" },
      { 'value' : "{foo}", 'type' : "multichar_string" },
      { 'value' : "]", 'type' : "close_bracket" },
      { 'value' : "+", 'type' : "special_char" },
      { 'value' : "$", 'type' : "special_char" }
    ]);
  });
});
