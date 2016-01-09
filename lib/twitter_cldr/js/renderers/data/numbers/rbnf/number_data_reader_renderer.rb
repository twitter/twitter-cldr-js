# encoding: UTF-8

# Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0

module TwitterCldr
  module Js
    module Renderers
      module Data
        module Numbers
          module RBNF

            class NumberDataReaderRenderer < TwitterCldr::Js::Renderers::Base

              def resource
                TwitterCldr.supported_locales.inject({}) do |result, locale|
                  result[locale] = TwitterCldr.get_locale_resource(locale, :numbers)
                  result
                end
              end

              def get_data
                {
                  :NumberDataReader => {
                    :resource => resource()
                  }
                }
              end

            end
          end
        end
      end
    end
  end
end
