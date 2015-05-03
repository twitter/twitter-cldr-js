# encoding: UTF-8

# Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0

require 'cldr-plurals'
require 'cldr-plurals/javascript_runtime'

module TwitterCldr
  module Js
    module Renderers
      module ImplementationRenderers
        module PluralRules

          class PluralRulesRenderer < TwitterCldr::Js::Renderers::Base
            set_template "mustache/implementation/plurals/rules.coffee"

            def runtime
              CldrPlurals::JavascriptRuntime.source
            end

          end

        end
      end
    end
  end
end
