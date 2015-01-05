# encoding: UTF-8

# Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0

module TwitterCldr
  module Js
    module Renderers
      module TestHelpers

        class RBNFTestHelperRenderer < TwitterCldr::Js::Renderers::Base
          set_template "mustache/numbers/rbnf/rbnf_test_helper.coffee"

          def global_resource # TODO - optimize this be making resource[locale] = resource.
            result = {}
            TwitterCldr.supported_locales.each do |locale|
              result[locale] = TwitterCldr.resources.get_locale_resource(locale, "rbnf")[locale][:rbnf][:grouping]
            end
            result.to_json
          end

          def test_resource
            result = {}
            TwitterCldr.supported_locales.each do |locale|
              file_path = File.join(File.dirname(TwitterCldr::RESOURCES_DIR), '/spec/formatters/numbers/rbnf/locales/' + locale.to_s + '/rbnf_test.yml')
              result[locale] = YAML.load_file(file_path)
            end
            result.to_json
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
