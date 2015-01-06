# encoding: UTF-8

# Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0

require 'mustache'
require 'uglifier'
require 'coffee-script'

module TwitterCldr
  module Js
    CompiledFile = Struct.new(:source, :source_map)

    class Compiler
      attr_reader :locales

      def initialize(options = {})
        @locales = options[:locales] || TwitterCldr.supported_locales
        @features = options[:features] || implementation_renderers.keys
        @test_helpers = options[:test_helpers] || test_helper_renderers.keys
        @prerender = options[:prerender].nil? ? true : options[:prerender]
        @source_map = options[:source_map]
      end

      def compile_each(options = {})
        options[:minify] = true unless options.include?(:minify)

        @locales.each do |locale|
          contents = ""

          @features.each do |feature|
            renderer_const = implementation_renderers[feature]
            contents << renderer_const.new(:locale => locale, :prerender => @prerender).render if renderer_const
          end

          bundle = TwitterCldr::Js::Renderers::Bundle.new
          bundle[:locale] = locale
          bundle[:contents] = contents
          bundle[:source_map] = @source_map

          result = CoffeeScript.compile(bundle.render, {
            :bare => false,
            :sourceMap => @source_map
          })

          file = if @source_map
            CompiledFile.new(result["js"], result["sourceMap"])
          else
            CompiledFile.new(result)
          end

          # required alias definition that adds twitter_cldr to Twitter's static build process
          file.source.gsub!(/\/\*<<module_def>>\s+\*\//, %Q(/*-module-*/\n/*_lib/twitter_cldr_*/))
          file.source = Uglifier.compile(file.source) if options[:minify]

          yield file, TwitterCldr.twitter_locale(locale)
        end
      end
      def compile_test(options = {})
        options[:minify] = true unless options.include?(:minify)

        contents = ""
        @test_helpers.each do |test_helper|
          renderer_const = test_helper_renderers[test_helper]
          contents << renderer_const.new(:prerender => @prerender).render if renderer_const
        end
        bundle = TwitterCldr::Js::Renderers::TestBundle.new
        bundle[:contents] = contents
        bundle[:source_map] = @source_map

        result = CoffeeScript.compile(bundle.render, {
          :bare => false,
          :sourceMap => @source_map
        })

        file = if @source_map
          CompiledFile.new(result["js"], result["sourceMap"])
        else
          CompiledFile.new(result)
        end

        # required alias definition that adds twitter_cldr to Twitter's static build process
        file.source.gsub!(/\/\*<<module_def>>\s+\*\//, %Q(/*-module-*/\n/*_lib/twitter_cldr_*/))
        file.source = Uglifier.compile(file.source) if options[:minify]
        return file.source
      end

      private

      def implementation_renderers
        @implementation_renderers ||= {
          :plural_rules                    => TwitterCldr::Js::Renderers::PluralRules::PluralRulesRenderer,
          :timespan                        => TwitterCldr::Js::Renderers::Calendars::TimespanRenderer,
          :datetime                        => TwitterCldr::Js::Renderers::Calendars::DateTimeRenderer,
          :additional_date_format_selector => TwitterCldr::Js::Renderers::Calendars::AdditionalDateFormatSelectorRenderer,
          :currencies                      => TwitterCldr::Js::Renderers::Shared::CurrenciesRenderer,
          :lists                           => TwitterCldr::Js::Renderers::Shared::ListRenderer,
          :bidi                            => TwitterCldr::Js::Renderers::Shared::BidiRenderer,
          :calendar                        => TwitterCldr::Js::Renderers::Shared::CalendarRenderer,
          :code_point                      => TwitterCldr::Js::Renderers::Shared::CodePointRenderer,
          :phone_codes                     => TwitterCldr::Js::Renderers::Shared::PhoneCodesRenderer,
          :postal_codes                    => TwitterCldr::Js::Renderers::Shared::PostalCodesRenderer,
          :languages                       => TwitterCldr::Js::Renderers::Shared::LanguagesRenderer,
          :unicode_regex                   => TwitterCldr::Js::Renderers::Shared::UnicodeRegexRenderer,
          :break_iterator                  => TwitterCldr::Js::Renderers::Shared::BreakIteratorRenderer,
          :territories_containment         => TwitterCldr::Js::Renderers::Shared::TerritoriesContainmentRenderer,
          :number_parser                   => TwitterCldr::Js::Renderers::Parsers::NumberParser,
          :component                       => TwitterCldr::Js::Renderers::Parsers::ComponentRenderer,
          :literal                         => TwitterCldr::Js::Renderers::Parsers::LiteralRenderer,
          :unicode_string                  => TwitterCldr::Js::Renderers::Parsers::UnicodeStringRenderer,
          :character_class                 => TwitterCldr::Js::Renderers::Parsers::CharacterClassRenderer,
          :character_range                 => TwitterCldr::Js::Renderers::Parsers::CharacterRangeRenderer,
          :character_set                   => TwitterCldr::Js::Renderers::Parsers::CharacterSetRenderer,
          :symbol_table                    => TwitterCldr::Js::Renderers::Parsers::SymbolTableRenderer,
          :parser                          => TwitterCldr::Js::Renderers::Parsers::ParserRenderer,
          :segmentation_parser             => TwitterCldr::Js::Renderers::Parsers::SegmentationParserRenderer,
          :unicode_regex_parser            => TwitterCldr::Js::Renderers::Parsers::UnicodeRegexParserRenderer,
          :token                           => TwitterCldr::Js::Renderers::Tokenizers::TokenRenderer,
          :composite_token                 => TwitterCldr::Js::Renderers::Tokenizers::CompositeTokenRenderer,
          :tokenizer                       => TwitterCldr::Js::Renderers::Tokenizers::TokenizerRenderer,
          :segmentation_tokenizer          => TwitterCldr::Js::Renderers::Tokenizers::SegmentationTokenizerRenderer,
          :unicode_regex_tokenizer         => TwitterCldr::Js::Renderers::Tokenizers::UnicodeRegexTokenizerRenderer,
          :rbnf_tokenizer                  => TwitterCldr::Js::Renderers::Tokenizers::RBNFTokenizerRenderer,
          :number_tokenizer                => TwitterCldr::Js::Renderers::Tokenizers::NumberTokenizerRenderer,
          :pattern_tokenizer               => TwitterCldr::Js::Renderers::Tokenizers::PatternTokenizerRenderer,
          :numbers                         => TwitterCldr::Js::Renderers::Numbers::NumbersRenderer,
          :rbnf                            => TwitterCldr::Js::Renderers::Numbers::RBNFRenderer,
          :number_data_reader              => TwitterCldr::Js::Renderers::Numbers::NumberDataReaderRenderer,
          :rbnf_formatters                 => TwitterCldr::Js::Renderers::Numbers::RBNFFormattersRenderer,
          :rbnf_rule                       => TwitterCldr::Js::Renderers::Numbers::RBNFRuleRenderer,
          :rbnf_rule_group                 => TwitterCldr::Js::Renderers::Numbers::RBNFRuleGroupRenderer,
          :rbnf_rule_set                   => TwitterCldr::Js::Renderers::Numbers::RBNFRuleSetRenderer,
          :rbnf_substitution               => TwitterCldr::Js::Renderers::Numbers::RBNFSubstitutionRenderer,
          :rbnf_rule_parser                => TwitterCldr::Js::Renderers::Numbers::RBNFRuleParserRenderer,
          :plural                          => TwitterCldr::Js::Renderers::Numbers::RBNFPluralRenderer,
          :range                           => TwitterCldr::Js::Renderers::Utils::RangeRenderer,
          :range_set                       => TwitterCldr::Js::Renderers::Utils::RangeSetRenderer,
          :code_points                     => TwitterCldr::Js::Renderers::Utils::CodePointsRenderer
        }
      end

      def test_helper_renderers
        @test_helper_renderers ||= {
          :rbnf                            => TwitterCldr::Js::Renderers::TestHelpers::RBNFTestHelperRenderer
        }
      end

    end
  end
end