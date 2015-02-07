// Copyright 2012 Twitter, Inc
// http://www.apache.org/licenses/LICENSE-2.0

var TwitterCldr = require('../../../lib/assets/javascripts/twitter_cldr/en.js');
eval(require('fs').readFileSync('lib/assets/javascripts/twitter_cldr/test_resources.js', 'utf8'));
formatter = new TwitterCldr.RBNF();
var failures = {};
describe("RBNF", function() {
  formatter.resource = TwitterCldr.RBNF.global_resource;
  for (locale in TwitterCldr.RBNF.test_resource) {
    if (locale !== "en" && locale !== "pt" && locale !== "es")
      continue;

    TwitterCldr.PluralRules.rules = TwitterCldr.PluralRules.global_rules[locale]
    TwitterCldr.PluralRules.names = TwitterCldr.PluralRules.global_names[locale]
    TwitterCldr.NumberFormatter.all_tokens = TwitterCldr.NumberFormatter.global_tokens[locale]
    TwitterCldr.NumberFormatter.symbols = TwitterCldr.NumberFormatter.global_symbols[locale]

    formatter.locale = locale;
    for (rule_group in TwitterCldr.RBNF.test_resource[locale]) {
      if (!rule_group.search(/duration/i)) {
        continue;
      }
      for (rule_set in TwitterCldr.RBNF.test_resource[locale][rule_group]) {
        for (test_case in TwitterCldr.RBNF.test_resource[locale][rule_group][rule_set]) {
          describe("for locale: " + locale + " for Group: " + rule_group + " for Set: " + rule_set, function(){
            try {
              var got = formatter.format(TwitterCldr.PluralRules.runtime.toNum(test_case), {'rule_group' : rule_group, 'rule_set': rule_set});
              var expected = TwitterCldr.RBNF.test_resource[locale][rule_group][rule_set][test_case];
              it("formats " + test_case + " correctly", function() {
                expect(got).toEqual(expected);
              });
            }
            catch (error) {

            }
          });
        }
      }
    }
  }
});
TwitterCldr.PluralRules.rules = TwitterCldr.PluralRules.global_rules["en"]
TwitterCldr.PluralRules.names = TwitterCldr.PluralRules.global_names["en"]
TwitterCldr.NumberFormatter.all_tokens = TwitterCldr.NumberFormatter.global_tokens["en"]
TwitterCldr.NumberFormatter.symbols = TwitterCldr.NumberFormatter.global_symbols["en"]