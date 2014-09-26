# encoding: UTF-8

# Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0

module TwitterCldr
  module Js
    module Renderers
      module Calendars

        class TimespanRenderer < TwitterCldr::Js::Renderers::Base
          set_template "mustache/calendars/timespan.coffee"

          def patterns
            [:ago, :until, :none].inject({}) do |final, direction|
              final[direction] = DataReaders::TimespanDataReader::VALID_UNITS.inject({}) do |unit_hash, unit|
                unit_hash[unit] = DataReaders::TimespanDataReader.all_types_for(locale, unit, direction).inject({}) do |type_hash, type|
                  # using PluralRulesRenderer instead of TwitterCldr::Formatters::Plurals::Rules so that
                  # TwitterCldr.TimespanFormatter uses the same pluralization rules as TwitterCldr.PluralRules that
                  # might not be as up-to-date as the ones in twitter-cldr-rb (see PluralRulesRenderer#rules for more info)
                  type_hash[type] = PluralRules::PluralRulesRenderer.new(:locale => @locale).all_rules.inject({}) do |rule_hash, rule|
                    data_reader = DataReaders::TimespanDataReader.new(
                      locale,
                      1, # the value doesn't matter since we provide :rule option
                      :type => type,
                      :direction => direction,
                      :unit => unit,
                      :rule => rule
                    )

                    rule_hash[rule] = data_reader.pattern
                    rule_hash
                  end
                  type_hash
                end
                unit_hash
              end
              final
            end.to_json
          end

        end

      end
    end
  end
end