# encoding: UTF-8

# Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0

module TwitterCldr
  module Js
    module Renderers
      module Data
        module Numbers
          module RBNF

            class RBNFRenderer < TwitterCldr::Js::Renderers::Base

              def resource
                {
                  locale.to_sym => TwitterCldr.resources.get_locale_resource(locale, "rbnf")[locale][:rbnf][:grouping]
                }
              end

              def get_data
                {
                  :RBNF => {
                    :resource => resource()
                  }
                }
              end

            end

            autoload :NumberDataReaderRenderer, 'twitter_cldr/js/renderers/data/numbers/rbnf/number_data_reader_renderer'

          end
        end
      end
    end
  end
end
