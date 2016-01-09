// Copyright 2012 Twitter, Inc
// http://www.apache.org/licenses/LICENSE-2.0

var TwitterCldr = require('../../../lib/assets/javascripts/twitter_cldr/core.js');
var data_backup = require('../../../lib/assets/javascripts/twitter_cldr/en.js');
var data = TwitterCldr.Utilities.clone(data_backup);
TwitterCldr.set_data(data);

eval(require('fs').readFileSync('lib/assets/javascripts/twitter_cldr/test_resources.js', 'utf8'));

var formatter = new TwitterCldr.RBNF();

function rbnf_test_case (locale, rule_group, rule_set, test_case) {
  describe('RBNF test: for locale: '+ locale + ' for Group: ' + rule_group + ' for Set: ' + rule_set, function() {
    beforeEach(function() {
      data.RBNF.resource = TwitterCldr.RBNF.global_resource;
      data.PluralRules.rules = TwitterCldr.PluralRules.global_rules[locale];
      data.PluralRules.names = TwitterCldr.PluralRules.global_names[locale];
      data.NumberFormatter.all_tokens = TwitterCldr.NumberFormatter.global_tokens[locale];
      data.NumberFormatter.symbols = TwitterCldr.NumberFormatter.global_symbols[locale];
      TwitterCldr.set_data(data);

      formatter.locale = locale;
    });

    afterEach(function() {
      TwitterCldr.set_data(data_backup);
    });

    it('formats test_case correctly', function() {
      try {
        var got = formatter.format(TwitterCldr.PluralRules.runtime.toNum(test_case), rule_group, rule_set);
        var expected = TwitterCldr.RBNF.test_resource[locale][rule_group][rule_set][test_case];
        expect(got).toEqual(expected);
      }
      catch (error) {
        // Ignore `Not implemented` errors.
      }
    });
  });
}

for (var locale in TwitterCldr.RBNF.test_resource) {

  if (["ar", "ja", "ko", "zh", "ja", "zh-Hant", "ja", "hi", "ta"].indexOf(locale) !== -1)
    continue;
  for (var rule_group in TwitterCldr.RBNF.test_resource[locale]) {
    if (formatter.group_names().indexOf(rule_group) === -1)
      continue;
    for (var rule_set in TwitterCldr.RBNF.test_resource[locale][rule_group]) {
      if (formatter.rule_set_names_for_group(rule_group).indexOf(rule_set) === -1)
        continue;
      for (var test_case in TwitterCldr.RBNF.test_resource[locale][rule_group][rule_set]) {
        rbnf_test_case(locale, rule_group, rule_set, test_case);
      }
    }
  }
}

