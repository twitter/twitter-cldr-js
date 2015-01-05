# encoding: UTF-8

# Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0

module TwitterCldr
  module Js
    module Renderers
      class TestBundle < Mustache
        self.template_path = File.expand_path(File.join(File.dirname(__FILE__), "..", "mustache"))
        self.template_file = File.join(self.template_path, "test_bundle.coffee")
        self.template_extension = "coffee"
      end
    end
  end
end