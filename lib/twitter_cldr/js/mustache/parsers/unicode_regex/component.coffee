# Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0

class TwitterCldr.Component
  @to_utf8 : (codepoints) ->
    if !(codepoints instanceof Array)
      codepoints = [codepoints]

    codepoints.map ( (c) -> 
      s = c.toString(16)
      while s.length < 4 
        s = "0" + s 

      return "\\u{" + s + "}"; 
    )

  @range_to_regex : (range) ->
    if range[0] instanceof Array
      array_to_regex(range)
    else
      "["+@to_utf8(range[0])+"-"+range[0]+"]" # todo - check this.

  @array_to_regex : (arr) ->
    arr.map ( (c) ->
      return "(?:" + to_utf8(elem) + ")"
    )


        

        def set_to_regex(set)
          strs = set.to_a(true).uniq.map do |obj|
            case obj
              when Range
                range_to_regex(obj)
              when Array
                array_to_regex(obj)
              else
                to_utf8(obj)
            end
          end

          "(?:#{strs.join("|")})"
        end

      end
    end
  end
end
