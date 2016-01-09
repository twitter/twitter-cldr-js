# encoding: UTF-8

# Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0

module TwitterCldr
  module Js
    module Renderers
      module Data
        module Shared

          class BreakIteratorRenderer < TwitterCldr::Js::Renderers::Base

            def root_resource_data
              resource = TwitterCldr.get_resource("shared", "segments", "segments_root")
              resource
            end

            def tailoring_resource_data
              available_locales = Dir.entries(TwitterCldr::RESOURCES_DIR + "/shared/segments/tailorings").inject([]) { |ret, file|
                if file[0] != '.'
                  ret << (file.chomp(File.extname(file)))
                end
                ret
              }
              resource = available_locales.inject({}) { |ret, locale|
                ret[locale] = TwitterCldr.get_resource("shared", "segments", "tailorings", locale)
                ret
              }
              resource
            end

            def exceptions_resource_data
              available_locales = Dir.entries(TwitterCldr::RESOURCES_DIR + "/uli/segments").inject([]) { |ret, file|
                if file[0] != '.'
                  ret << (file.chomp(File.extname(file)))
                end
                ret
              }
              available_locales.inject({}) { |ret, locale|
                ret[locale] = TwitterCldr.get_resource("uli", "segments", locale)
                ret
              }
            end

            def get_data
              {
                :BreakIterator => {
                  :tailoring_resource_data => tailoring_resource_data(),
                  :exceptions_resource_data => exceptions_resource_data(),
                  :root_resource => root_resource_data()
                }
              }
            end

          end
        end
      end
    end
  end
end
