# Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0

class TwitterCldr.RBNFPlural
  @from_string : (string, locale = TwitterCldr.locale) ->
    # $(cardinal,one{ tysiąc}few{ tysiące}other{ tysięcy})$
    [plural_type, cases_map] = string.match(/\$\((.*)\)\$/)[1].split(',')
    cases = {}

    # one{ tysiąc}few{ tysiące}other{ tysięcy}
    split_regex = /([\w]+)\{([^}]+)\}/g
    while match = split_regex.exec(cases_map)
      cases[match[1]] = match[2]

    new TwitterCldr.RBNFPlural(locale, plural_type, cases)

  # plural_type = cardinal, etc
  # cases = hash of form one: "foo", two: "bar"
  constructor : (@locale, @plural_type, @cases) ->
    @type = "plural"

  type : ->
    @type

  render : (number) ->
    rule_name = TwitterCldr.PluralRules.rule_for(number, @plural_type)
    @cases[rule_name] || @cases["other"]
