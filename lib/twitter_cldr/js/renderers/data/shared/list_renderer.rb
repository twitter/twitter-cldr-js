# encoding: UTF-8

# Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0

module TwitterCldr
  module Js
    module Renderers
      module Data
        module Shared

          class ListRenderer < TwitterCldr::Js::Renderers::Base

            def formats
              TwitterCldr.get_locale_resource(@locale, :lists)[@locale][:lists][:default]
            end

            def get_data
              {
                :ListFormatter => {
                  :formats => formats()
                }
              }
            end

          end

        end
      end
    end
  end
end
