# encoding: UTF-8

# Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0
require 'pry'

module TwitterCldr
  module Js
    module Renderers
      module Shared
        class BreakIteratorRenderer < TwitterCldr::Js::Renderers::Base
          self.template_file = File.expand_path(File.join(File.dirname(__FILE__), "../..", "mustache/shared/break_iterator.coffee"))

          def escape_string(str)
            str.unpack("U*").map { |char| 
              ('\\u' +  "0000"[0...char.to_s(16).size] + char.to_s(16))
            }.join
          end

          def escape_resource(h)
            if h.is_a?(Hash)
              h.each_pair do |k,v|
                if v.is_a?(String) and k == :value and v[0] != "\\"
                  v.replace escape_string(v)
                elsif v.is_a?(Array) or v.is_a?(Hash)
                  escape_resource(v)
                end
              end
            elsif h.is_a?(Array)
              h.each { |element|
                if element.is_a?(Array) or element.is_a?(Hash)
                  escape_resource(element)
                end
              }
            end
          end

          def root_resource_data
            resource = TwitterCldr.get_resource("shared", "segments", "segments_root")
            escape_resource(resource)
            resource.to_json
          end

          def tailoring_resource_data
            available_locales = Dir.entries(TwitterCldr::RESOURCES_DIR + "/shared/segments/tailorings").inject([]) { |ret, file|  
              if file[0] != '.'
                ret << (file[0...file.size-4])
              end
              ret
            }
            resource = available_locales.inject({}) { |ret, locale| 
              ret[locale] = TwitterCldr.get_resource("shared", "segments", "tailorings", locale)
              ret
            }
            escape_resource(resource)
            resource.to_json
          end

          def exceptions_resource_data
            available_locales = Dir.entries(TwitterCldr::RESOURCES_DIR + "/uli/segments").inject([]) { |ret, file|  
              if file[0] != '.'
                ret << (file[0...file.size-4])
              end
              ret
            }
            available_locales.inject({}) { |ret, locale| 
              ret[locale] = TwitterCldr.get_resource("uli", "segments", locale)
              ret
            }.to_json
          end

        end
      end
    end
  end
end