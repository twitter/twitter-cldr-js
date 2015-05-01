// Copyright 2012 Twitter, Inc
// http://www.apache.org/licenses/LICENSE-2.0

var TwitterCldr = require('../../../lib/assets/javascripts/twitter_cldr/twitter_cldr.js');

describe("SegmentationTokenizer", function() {
  var tokenizer = new TwitterCldr.SegmentationTokenizer();
  it("should tokenize an expression with a non-break", function() {
    expect(tokenizer.tokenize("$CB ÷ $SP")).toEqualTokenList([
      { 'value' : "$CB", 'type' : "variable" },
      { 'value' : "÷", 'type' : "break" },
      { 'value' : "$SP", 'type' : "variable" }
    ]);
  });
  it("should tokenize an expression with a non-break", function() {
    expect(tokenizer.tokenize("$ATerm × $Numeric")).toEqualTokenList([
      { 'value' : "$ATerm", 'type' : "variable" },
      { 'value' : "×", 'type' : "no_break" },
      { 'value' : "$Numeric", 'type' : "variable" }
    ]);
  });
});