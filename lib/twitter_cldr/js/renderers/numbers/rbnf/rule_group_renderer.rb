# encoding: UTF-8

# Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0

module TwitterCldr
  module Js
    module Renderers
      module Numbers

        class RBNFRuleGroupRenderer < TwitterCldr::Js::Renderers::Base
          set_template "mustache/numbers/rbnf/rule_group.coffee"
        end

      end
    end
  end
end