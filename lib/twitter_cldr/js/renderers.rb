# encoding: UTF-8

# Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0

module TwitterCldr
  module Js
    module Renderers
      autoload :Base,                                   'twitter_cldr/js/renderers/base'
      autoload :Bundle,                                 'twitter_cldr/js/renderers/bundle'
      autoload :DataBundle,                             'twitter_cldr/js/renderers/data_bundle'
      autoload :TestBundle,                             'twitter_cldr/js/renderers/test_bundle'

      module ImplementationRenderers
        autoload :Calendars,                              'twitter_cldr/js/renderers/implementation/calendars'
        autoload :PluralRules,                            'twitter_cldr/js/renderers/implementation/plurals'

        module Numbers
          autoload :NumbersRenderer,                      'twitter_cldr/js/renderers/data/numbers/numbers_renderer'
          autoload :RBNF,                                 'twitter_cldr/js/renderers/data/numbers/rbnf'
        end

        module Shared
          autoload :BidiRenderer,                         'twitter_cldr/js/renderers/data/shared/bidi_renderer'
          autoload :BreakIteratorRenderer,                'twitter_cldr/js/renderers/data/shared/break_iterator_renderer'
          autoload :CodePointRenderer,                    'twitter_cldr/js/renderers/data/shared/code_point_renderer'
          autoload :CalendarRenderer,                     'twitter_cldr/js/renderers/implementation/shared'
          autoload :CurrenciesRenderer,                   'twitter_cldr/js/renderers/implementation/shared/currencies_renderer'
          autoload :LanguagesRenderer,                    'twitter_cldr/js/renderers/data/shared/languages_renderer'
          autoload :ListRenderer,                         'twitter_cldr/js/renderers/data/shared/list_renderer'
          autoload :NumberingSystemsRenderer,             'twitter_cldr/js/renderers/data/shared/numbering_systems_renderer'
          autoload :PhoneCodesRenderer,                   'twitter_cldr/js/renderers/implementation/shared/phone_codes_renderer'
          autoload :PostalCodesRenderer,                  'twitter_cldr/js/renderers/implementation/shared/postal_codes_renderer'
          autoload :LanguagesRenderer,                    'twitter_cldr/js/renderers/data/shared/languages_renderer'
          autoload :UnicodeRegexRenderer,                 'twitter_cldr/js/renderers/data/shared/unicode_regex_renderer'
          autoload :TerritoriesContainmentRenderer,       'twitter_cldr/js/renderers/implementation/shared/territories_containment_renderer'
        end

        module Parsers
          autoload :NumberParser,                         'twitter_cldr/js/renderers/data/parsers/number_parser'
          autoload :SymbolTableRenderer,                  'twitter_cldr/js/renderers/data/parsers/symbol_table'
          autoload :ComponentRenderer,                    'twitter_cldr/js/renderers/data/parsers/unicode_regex/component'
          autoload :LiteralRenderer,                      'twitter_cldr/js/renderers/data/parsers/unicode_regex/literal'
          autoload :UnicodeStringRenderer,                'twitter_cldr/js/renderers/data/parsers/unicode_regex/unicode_string'
          autoload :CharacterClassRenderer,               'twitter_cldr/js/renderers/data/parsers/unicode_regex/character_class'
          autoload :CharacterRangeRenderer,               'twitter_cldr/js/renderers/data/parsers/unicode_regex/character_range'
          autoload :CharacterSetRenderer,                 'twitter_cldr/js/renderers/data/parsers/unicode_regex/character_set'
          autoload :ParserRenderer,                       'twitter_cldr/js/renderers/data/parsers/parser'
          autoload :SegmentationParserRenderer,           'twitter_cldr/js/renderers/data/parsers/segmentation_parser'
          autoload :UnicodeRegexParserRenderer,           'twitter_cldr/js/renderers/data/parsers/unicode_regex_parser'
        end

        module Tokenizers
          autoload :TokenRenderer,                        'twitter_cldr/js/renderers/data/tokenizers/token'
          autoload :CompositeTokenRenderer,               'twitter_cldr/js/renderers/data/tokenizers/composite_token'
          autoload :TokenizerRenderer,                    'twitter_cldr/js/renderers/data/tokenizers/tokenizer'
          autoload :SegmentationTokenizerRenderer,        'twitter_cldr/js/renderers/data/tokenizers/segmentation_tokenizer'
          autoload :PatternTokenizerRenderer,             'twitter_cldr/js/renderers/data/tokenizers/pattern_tokenizer_renderer'
          autoload :UnicodeRegexTokenizerRenderer,        'twitter_cldr/js/renderers/data/tokenizers/unicode_regex/unicode_regex_tokenizer'
          autoload :RBNFTokenizerRenderer,                'twitter_cldr/js/renderers/data/tokenizers/numbers/rbnf_renderer'
          autoload :NumberTokenizerRenderer,              'twitter_cldr/js/renderers/data/tokenizers/numbers/number_tokenizer_renderer'
        end

        module Utils
          autoload :RangeRenderer,                        'twitter_cldr/js/renderers/data/utils/range'
          autoload :RangeSetRenderer,                     'twitter_cldr/js/renderers/data/utils/range_set'
          autoload :CodePointsRenderer,                   'twitter_cldr/js/renderers/data/utils/code_points'
        end
      end

      module DataRenderers
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
          autoload :BidiRenderer,                         'twitter_cldr/js/renderers/data/shared/bidi_renderer'
          autoload :BreakIteratorRenderer,                'twitter_cldr/js/renderers/data/shared/break_iterator_renderer'
          autoload :CodePointRenderer,                    'twitter_cldr/js/renderers/data/shared/code_point_renderer'
          autoload :CalendarRenderer,                     'twitter_cldr/js/renderers/data/shared/calendar_renderer'
          autoload :CurrenciesRenderer,                   'twitter_cldr/js/renderers/data/shared/currencies_renderer'
          autoload :LanguagesRenderer,                    'twitter_cldr/js/renderers/data/shared/languages_renderer'
          autoload :ListRenderer,                         'twitter_cldr/js/renderers/data/shared/list_renderer'
          autoload :NumberingSystemsRenderer,             'twitter_cldr/js/renderers/data/shared/numbering_systems_renderer'
          autoload :PhoneCodesRenderer,                   'twitter_cldr/js/renderers/data/shared/phone_codes_renderer'
          autoload :PostalCodesRenderer,                  'twitter_cldr/js/renderers/data/shared/postal_codes_renderer'
          autoload :LanguagesRenderer,                    'twitter_cldr/js/renderers/data/shared/languages_renderer'
          autoload :UnicodeRegexRenderer,                 'twitter_cldr/js/renderers/data/shared/unicode_regex_renderer'
          autoload :TerritoriesContainmentRenderer,       'twitter_cldr/js/renderers/data/shared/territories_containment_renderer'
        end

        module Parsers
          autoload :NumberParser,                         'twitter_cldr/js/renderers/data/parsers/number_parser'
          autoload :SymbolTableRenderer,                  'twitter_cldr/js/renderers/data/parsers/symbol_table'
          autoload :ComponentRenderer,                    'twitter_cldr/js/renderers/data/parsers/unicode_regex/component'
          autoload :LiteralRenderer,                      'twitter_cldr/js/renderers/data/parsers/unicode_regex/literal'
          autoload :UnicodeStringRenderer,                'twitter_cldr/js/renderers/data/parsers/unicode_regex/unicode_string'
          autoload :CharacterClassRenderer,               'twitter_cldr/js/renderers/data/parsers/unicode_regex/character_class'
          autoload :CharacterRangeRenderer,               'twitter_cldr/js/renderers/data/parsers/unicode_regex/character_range'
          autoload :CharacterSetRenderer,                 'twitter_cldr/js/renderers/data/parsers/unicode_regex/character_set'
          autoload :ParserRenderer,                       'twitter_cldr/js/renderers/data/parsers/parser'
          autoload :SegmentationParserRenderer,           'twitter_cldr/js/renderers/data/parsers/segmentation_parser'
          autoload :UnicodeRegexParserRenderer,           'twitter_cldr/js/renderers/data/parsers/unicode_regex_parser'
        end

        module Tokenizers
          autoload :TokenRenderer,                        'twitter_cldr/js/renderers/data/tokenizers/token'
          autoload :CompositeTokenRenderer,               'twitter_cldr/js/renderers/data/tokenizers/composite_token'
          autoload :TokenizerRenderer,                    'twitter_cldr/js/renderers/data/tokenizers/tokenizer'
          autoload :SegmentationTokenizerRenderer,        'twitter_cldr/js/renderers/data/tokenizers/segmentation_tokenizer'
          autoload :PatternTokenizerRenderer,             'twitter_cldr/js/renderers/data/tokenizers/pattern_tokenizer_renderer'
          autoload :UnicodeRegexTokenizerRenderer,        'twitter_cldr/js/renderers/data/tokenizers/unicode_regex/unicode_regex_tokenizer'
          autoload :RBNFTokenizerRenderer,                'twitter_cldr/js/renderers/data/tokenizers/numbers/rbnf_renderer'
          autoload :NumberTokenizerRenderer,              'twitter_cldr/js/renderers/data/tokenizers/numbers/number_tokenizer_renderer'
        end

        module Utils
          autoload :RangeRenderer,                        'twitter_cldr/js/renderers/data/utils/range'
          autoload :RangeSetRenderer,                     'twitter_cldr/js/renderers/data/utils/range_set'
          autoload :CodePointsRenderer,                   'twitter_cldr/js/renderers/data/utils/code_points'
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
