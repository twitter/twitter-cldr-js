# encoding: UTF-8

# Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0

module TwitterCldr
  module Js
    module Renderers
      module TestHelpers

        class RBNFHelperRenderer < TwitterCldr::Js::Renderers::Base
          set_template "mustache/test_helpers/rbnf_helper.coffee"

          def global_resource
            TwitterCldr.supported_locales.inject({}) do |result, locale|
              result[locale] = TwitterCldr.resources.get_locale_resource(locale, "rbnf")[locale][:rbnf][:grouping]
              result
            end.to_json
          end

          def test_resource
            TwitterCldr.supported_locales.inject({}) do |result, locale|
              file_path = File.join(File.dirname(TwitterCldr::RESOURCES_DIR), 'spec/formatters/numbers/rbnf/locales', locale.to_s, 'rbnf_test.yml')
              result[locale] = YAML.load_file(file_path)
              result
            end.to_json
          end

          def allowed_failures
            file_path = File.join(File.dirname(TwitterCldr::RESOURCES_DIR), '/spec/formatters/numbers/rbnf/allowed_failures.yml')
            result = YAML.load_file(file_path)
            result.to_json
          end

        end
      end
    end
  end
end
