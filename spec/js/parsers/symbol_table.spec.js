// Copyright 2012 Twitter, Inc
// http://www.apache.org/licenses/LICENSE-2.0

var TwitterCldr = require('../../../lib/assets/javascripts/twitter_cldr/core.js');
var data = require('../../../lib/assets/javascripts/twitter_cldr/en.js');

describe("SymbolTable", function() {
  var table;
  beforeEach(function() {
    TwitterCldr.set_data(data);
    table = new TwitterCldr.SymbolTable ({"a":"b", "c":"d"});
  });
  describe("#fetch", function() {
    it("should be able to retrieve values for symbols", function() {
      expect(table.fetch("a")).toEqual("b");
      expect(table.fetch("z")).not.toBeDefined();
    });
    it("should be able to add then fetch new values for symbols", function() {
      table.add("e", "f");
      expect(table.fetch("e")).toEqual("f");
    });
  });
});
