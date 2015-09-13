// Copyright 2012 Twitter, Inc
// http://www.apache.org/licenses/LICENSE-2.0

var TwitterCldr = require('../../../lib/assets/javascripts/twitter_cldr/twitter_cldr.js');
var data = require('../../../lib/assets/javascripts/twitter_cldr/en.js');
TwitterCldr.set_data(data);

var en_rbnf_data_backup = TwitterCldr.Utilities.clone(data.RBNF);
var en_plural_rules_data_backup = TwitterCldr.Utilities.clone(data.PluralRules);
var en_number_formatter_data_backup = TwitterCldr.Utilities.clone(data.NumberFormatter);

eval(require('fs').readFileSync('lib/assets/javascripts/twitter_cldr/test_resources.js', 'utf8'));

var formatter = new TwitterCldr.RBNF();

describe("RBNF", function() {

  for (var locale in TwitterCldr.RBNF.test_resource) {
    if (["ar", "ja", "ko", "zh", "ja", "zh-Hant", "ja", "hi", "ta"].indexOf(locale) !== -1)
      continue;

    data.RBNF.resource = TwitterCldr.RBNF.global_resource;
    data.PluralRules.rules = TwitterCldr.PluralRules.global_rules[locale];
    data.PluralRules.names = TwitterCldr.PluralRules.global_names[locale];
    data.NumberFormatter.all_tokens = TwitterCldr.NumberFormatter.global_tokens[locale];
    data.NumberFormatter.symbols = TwitterCldr.NumberFormatter.global_symbols[locale];
    TwitterCldr.set_data(data);

    formatter.locale = locale;

    describe("for locale: " + locale, function() {
      for (var rule_group in TwitterCldr.RBNF.test_resource[locale]) {
        if (formatter.group_names().indexOf(rule_group) === -1)
          continue;

        describe("for Group: " + rule_group, function() {
          for (var rule_set in TwitterCldr.RBNF.test_resource[locale][rule_group]) {
            if (formatter.rule_set_names_for_group(rule_group).indexOf(rule_set) === -1)
              continue;

            describe("for Set: " + rule_set, function() {
              it("formats " + "test_case" + " correctly", function() {
                for (var test_case in TwitterCldr.RBNF.test_resource[locale][rule_group][rule_set]) {
                  try {
                    var got = formatter.format(TwitterCldr.PluralRules.runtime.toNum(test_case), rule_group, rule_set);
                    var expected = TwitterCldr.RBNF.test_resource[locale][rule_group][rule_set][test_case];

                    expect(got).toEqual(expected);
                  }
                  catch (error) {
                    // Ignore `Not implemented` errors.
                  }
                }
              });
            });
          }
        });
      }
    });
  }
});

data.PluralRules = en_plural_rules_data_backup;
data.NumberFormatter = en_number_formatter_data_backup;
data.RBNF = en_rbnf_data_backup;
TwitterCldr.set_data(data);

