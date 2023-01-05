# encoding: UTF-8

# Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0

module TwitterCldr
  module Js
    module Renderers
      autoload :Base,                                     'twitter_cldr/js/renderers/base'
      autoload :Bundle,                                   'twitter_cldr/js/renderers/bundle'
      autoload :DataBundle,                               'twitter_cldr/js/renderers/data_bundle'
      autoload :TestBundle,                               'twitter_cldr/js/renderers/test_bundle'

      module Implementation
        autoload :Settings,                               'twitter_cldr/js/renderers/implementation/settings'
        autoload :Calendars,                              'twitter_cldr/js/renderers/implementation/calendars'
        autoload :PluralRules,                            'twitter_cldr/js/renderers/implementation/plurals'
        autoload :Utils,                                  'twitter_cldr/js/renderers/implementation/utils'
        autoload :Numbers,                                'twitter_cldr/js/renderers/implementation/numbers'
        autoload :Parsers,                                'twitter_cldr/js/renderers/implementation/parsers'
        autoload :Tokenizers,                             'twitter_cldr/js/renderers/implementation/tokenizers'
        autoload :Clone,                                  'twitter_cldr/js/renderers/implementation/clone'

      module Shared
          autoload :BidiRenderer,                         'twitter_cldr/js/renderers/implementation/shared/bidi_renderer'
          autoload :BreakIteratorRenderer,                'twitter_cldr/js/renderers/implementation/shared'
          autoload :CodePointRenderer,                    'twitter_cldr/js/renderers/implementation/shared'
          autoload :CalendarRenderer,                     'twitter_cldr/js/renderers/implementation/shared'
          autoload :CurrenciesRenderer,                   'twitter_cldr/js/renderers/implementation/shared/currencies_renderer'
          autoload :LanguagesRenderer,                    'twitter_cldr/js/renderers/implementation/shared/languages_renderer'
          autoload :ListRenderer,                         'twitter_cldr/js/renderers/implementation/shared'
          autoload :NumberingSystemsRenderer,             'twitter_cldr/js/renderers/implementation/shared/numbering_systems_renderer'
          autoload :PhoneCodesRenderer,                   'twitter_cldr/js/renderers/implementation/shared/phone_codes_renderer'
          autoload :PostalCodesRenderer,                  'twitter_cldr/js/renderers/implementation/shared/postal_codes_renderer'
          autoload :LanguagesRenderer,                    'twitter_cldr/js/renderers/implementation/shared'
          autoload :UnicodeRegexRenderer,                 'twitter_cldr/js/renderers/implementation/shared'
          autoload :TerritoriesContainmentRenderer,       'twitter_cldr/js/renderers/implementation/shared/territories_containment_renderer'
        end

      end

      module Data

       autoload :Settings,                                'twitter_cldr/js/renderers/data/settings'

        module Calendars
          autoload :DateTimeRenderer,                     'twitter_cldr/js/renderers/data/calendars/datetime_renderer'
          autoload :TimespanRenderer,                     'twitter_cldr/js/renderers/data/calendars/timespan_renderer'
        end

        module Numbers
          autoload :NumbersRenderer,                      'twitter_cldr/js/renderers/data/numbers/numbers_renderer'
          autoload :RBNF,                                 'twitter_cldr/js/renderers/data/numbers/rbnf'
        end

        module PluralRules
          autoload :PluralRulesCompiler,                  'twitter_cldr/js/renderers/data/plurals/rules/plural_rules_compiler'
          autoload :PluralRulesRenderer,                  'twitter_cldr/js/renderers/data/plurals/rules/plural_rules_renderer'
        end

        module Shared
          autoload :BreakIteratorRenderer,                'twitter_cldr/js/renderers/data/shared/break_iterator_renderer'
          autoload :CodePointRenderer,                    'twitter_cldr/js/renderers/data/shared/code_point_renderer'
          autoload :CalendarRenderer,                     'twitter_cldr/js/renderers/data/shared/calendar_renderer'
          autoload :LanguagesRenderer,                    'twitter_cldr/js/renderers/data/shared/languages_renderer'
          autoload :ListRenderer,                         'twitter_cldr/js/renderers/data/shared/list_renderer'
        end

        module Parsers
          autoload :NumberParser,                         'twitter_cldr/js/renderers/data/parsers/number_parser'
        end

      end

      module TestRenderers
        module TestHelpers
          autoload :RBNFHelperRenderer,                   'twitter_cldr/js/renderers/test_helpers/rbnf_helper_renderer'
          autoload :PluralRulesHelperRenderer,            'twitter_cldr/js/renderers/test_helpers/plural_rules_helper_renderer'
          autoload :NumbersHelperRenderer,                'twitter_cldr/js/renderers/test_helpers/numbers_helper_renderer'
        end
      end

    end
  end
end
