# encoding: UTF-8

# Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0

module TwitterCldr
  module Js
    module Renderers
      class Base < Mustache

        attr_reader :locale

        def initialize(options = {})
          @locale = options[:locale]
        end

        def self.set_template(template_path)
          self.template_file = File.expand_path(File.join(File.dirname(__FILE__), "..", template_path))
        end

      end
    end
  end
end