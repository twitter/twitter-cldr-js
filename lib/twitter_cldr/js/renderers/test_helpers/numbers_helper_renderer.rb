# encoding: UTF-8

# Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0

module TwitterCldr
  module Js
    module Renderers
      module TestRenderers
        module TestHelpers

          class NumbersHelperRenderer < TwitterCldr::Js::Renderers::Base
            set_template "mustache/test_helpers/numbers_helper.coffee"

            def global_tokens
              TwitterCldr.supported_locales.inject({}) do |result, locale|
                numbers_renderer = TwitterCldr::Js::Renderers::DataRenderers::Numbers::NumbersRenderer.new
                result[locale] = numbers_renderer.tokens_for_locale(locale)
                result
              end.to_json
            end

            def global_symbols
              TwitterCldr.supported_locales.inject({}) do |result, locale|
                result[locale] = DataReaders::NumberDataReader.new(locale).symbols
                result
              end.to_json
            end

          end
        end
      end
    end
  end
end
