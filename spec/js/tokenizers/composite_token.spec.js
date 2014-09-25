// Copyright 2012 Twitter, Inc
// http://www.apache.org/licenses/LICENSE-2.0

var TwitterCldr = require('../../../lib/assets/javascripts/twitter_cldr/en.js');

describe("Token", function() {
  describe("#constructor", function() {
    it("should set an array of tokens", function() {
      token_0 = new TwitterCldr.Token({"type":"my_type_0", "value":"my_value_0"});
      token_1 = new TwitterCldr.Token({"type":"my_type_1", "value":"my_value_1"});
      
      composite_token = new TwitterCldr.CompositeToken ([token_0, token_1]);
      
      expect(composite_token.tokens.map(function(token){return token.type;})).toEqual(["my_type_0", "my_type_1"]);
      expect(composite_token.tokens.map(function(token){return token.value;})).toEqual(["my_value_0", "my_value_1"]);
    });
  });
  describe("#to_string", function() {
    it("should return the content", function() {
      token_0 = new TwitterCldr.Token({"type":"my_type_0", "value":"my_value_0"});
      token_1 = new TwitterCldr.Token({"type":"my_type_1", "value":"my_value_1"});
      
      composite_token = new TwitterCldr.CompositeToken ([token_0, token_1]);

      expect(composite_token.to_string()).toEqual("my_value_0my_value_1");
    });
  });
});
