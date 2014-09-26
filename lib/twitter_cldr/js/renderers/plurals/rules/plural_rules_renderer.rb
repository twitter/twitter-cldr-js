# encoding: UTF-8

# Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0

module TwitterCldr
  module Js
    module Renderers
      module PluralRules

        class PluralRulesRenderer < TwitterCldr::Js::Renderers::Base
          set_template "mustache/plurals/rules.coffee"

          RESOURCES_DIR = File.expand_path(File.join(File.dirname(__FILE__), "../../../../../../resources/locales"))

          # The representation of the pluralization rules in the latest version of twitter-cldr-rb is too complicated
          # for parsing and converting it into JavaScript. For now we're gonna use older pluralization data that was
          # generated using twitter-cldr-rb v2.1.0 (branch kl_plural_rules_for_js),
          # ruby-cldr from https://github.com/kl-7/ruby-cldr/tree/kl_old_plurals_format, and CLDR v22.1.
          #
          # TODO: In the future we should try to parse raw CLDR data right here and generate JavaScript version from
          # this data rather than from the Ruby lambdas in twitter-cldr-rb.
          def rules
            rule_str = raw_pluralization_rules.scan(/lambda\s*\{\s*\|n\|(.*?)\}/).first.first.strip
            js_str = PluralRulesCompiler.rule_to_js(rule_str)
            %Q({"keys": #{all_rules.to_json}, "rule": #{js_str}})
          end

          def all_rules
            pluralization_rules[@locale][:i18n][:plural][:keys]
          end

          private

          def pluralization_rules
            @pluralization_rules ||= eval(raw_pluralization_rules)
          end

          def raw_pluralization_rules
            @raw_pluralization_rules ||= load_pluralization_rules(@locale)
          end

          def load_pluralization_rules(locale)
            load_data(locale) || load_data(locale_fallback(locale))
          end

          def locale_fallback(locale)
            locale.split('-').first
          end

          def load_data(locale)
            file_name = resource_file_name(locale)
            YAML.load_file(file_name)[locale.to_sym] if File.file?(file_name)
          end

          def resource_file_name(locale)
            File.join(RESOURCES_DIR, "#{locale}/plurals.yml")
          end
        end

      end
    end
  end
end