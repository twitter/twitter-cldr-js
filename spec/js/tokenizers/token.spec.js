// Copyright 2012 Twitter, Inc
// http://www.apache.org/licenses/LICENSE-2.0

var TwitterCldr = require('../../../lib/assets/javascripts/twitter_cldr/en.js');

describe("Token", function() {
  describe("#constructor", function() {
    it("should set instance variables passed in the options hash", function() {
      token = new TwitterCldr.Token({"type":"my_type", "value":"my_value"});
      expect(token.type).toEqual("my_type");
      expect(token.value).toEqual("my_value");
    });
  });
  describe("#to_string", function() {
    it("should return the token's value", function() {
      expect(new TwitterCldr.Token({"value":"my_value"}).to_string()).toEqual("my_value");
    });
  });
  describe("#to_hash", function() {
    it("should return the token's attributes as a hash", function() {
      properties = {"type":"my_type", "value":"my_value"};
      expect(new TwitterCldr.Token(properties).to_hash()).toEqual(properties);
    });
  });
});