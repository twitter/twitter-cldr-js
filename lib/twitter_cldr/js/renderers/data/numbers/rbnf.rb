# encoding: UTF-8

# Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0

module TwitterCldr
  module Js
    module Renderers
      module DataRenderers
        module Numbers
          module RBNF

            class RBNFRenderer < TwitterCldr::Js::Renderers::Base
              set_template "mustache/data/numbers/rbnf/rbnf.coffee"

              def resource
                {
                  locale.to_sym => TwitterCldr.resources.get_locale_resource(locale, "rbnf")[locale][:rbnf][:grouping]
                }.to_json
              end
            end

            autoload :NumberDataReaderRenderer, 'twitter_cldr/js/renderers/data/numbers/rbnf/number_data_reader_renderer'

          end
        end
      end
    end
  end
end
