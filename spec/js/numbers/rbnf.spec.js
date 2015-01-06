// Copyright 2012 Twitter, Inc
// http://www.apache.org/licenses/LICENSE-2.0

var TwitterCldr = require('../../../lib/assets/javascripts/twitter_cldr/en.js');
eval(require('fs').readFileSync('lib/assets/javascripts/twitter_cldr/test_resources.js', 'utf8'));
var failures = {};
formatter = new TwitterCldr.RBNF();
describe("RBNF", function() {
  formatter.resource = TwitterCldr.RBNF.global_resource;
  for (locale in TwitterCldr.RBNF.test_resource) {
    if (locale !== "en")
      continue;
    formatter.locale = locale;
    for (rule_group in TwitterCldr.RBNF.test_resource[locale]) {
      if (!rule_group.search(/duration/i)) {
        continue;
      }
      for (rule_set in TwitterCldr.RBNF.test_resource[locale][rule_group]) {
        for (test_case in TwitterCldr.RBNF.test_resource[locale][rule_group][rule_set]) {
          describe("for locale: " + locale + " for Group: " + rule_group + " for Set: " + rule_set, function(){
            var got = formatter.format(toNum(test_case), {'rule_group' : rule_group, 'rule_set': rule_set});
            var expected = TwitterCldr.RBNF.test_resource[locale][rule_group][rule_set][test_case];
            it("formats " + test_case + " correctly", function() {
              expect(got).toEqual(expected);
            });
          });
        }
      }
    }
  }
});