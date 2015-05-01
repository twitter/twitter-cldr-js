// Copyright 2012 Twitter, Inc
// http://www.apache.org/licenses/LICENSE-2.0

var TwitterCldr = require('../../../lib/assets/javascripts/twitter_cldr/twitter_cldr.js');

describe("Parser", function() {
  var FakeParser,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  FakeParser = (function(_super) {
    __extends(FakeParser, _super);

    function FakeParser() {
      return FakeParser.__super__.constructor.apply(this, arguments);
    }

    FakeParser.prototype.do_parse = function(options) {
      if (options == null) {
        options = {};
      }
      return null;
    };

    return FakeParser;
  })(TwitterCldr.Parser);

  var tokens = [
    new TwitterCldr.Token({'type' : "a", 'value' : "a"}),
    new TwitterCldr.Token({'type' : "b", 'value' : "b"}),
    new TwitterCldr.Token({'type' : "c", 'value' : "c"})
  ];

  var parser = new FakeParser();

  describe("#parse", function() {
    it("should call do_parse", function() {
      spyOn(parser, "do_parse");
      parser.parse(tokens);
      expect(parser.do_parse).toHaveBeenCalled();
    });
  });

  describe("#reset", function() {
    it("should reset the token index", function() {
      parser.parse(tokens);
      parser.next_token("a");
      expect(parser.current_token().type).toEqual("b");
      parser.reset();
      expect(parser.current_token().type).toEqual("a");
    });
  });

  describe("next_token", function() {
    it("should advance to the next token", function() {
      parser.parse(tokens);
      parser.next_token("a");
      expect(parser.current_token().type).toEqual("b");
    });
    it("should raise an error after encountering an unexpected token", function() {
      parser.parse(tokens);
      expect(function() {
        parser.next_token("z");
      }).toThrow(new Error("Unexpected token"));
    });
  });

  describe("#current_token", function() {
    it("returns the current token", function() {
      parser.parse(tokens);
      expect(parser.current_token().type).toEqual("a");
    });
  });
});
