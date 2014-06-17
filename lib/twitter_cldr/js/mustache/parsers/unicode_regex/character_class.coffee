# Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0

class TwitterCldr.CharacterClass extends TwitterCldr.Component
  constructor : (@root) ->

  @grouping_pairs = {
    "close_bracket" : "open_bracket"
  }

  class BinaryOperator 
    constructor : (@operator, @left, @right) ->

  class UnaryOperator 
    constructor : (@operator, @child) ->

  @type = "character_class"

  @opening_types : ->
    keys = []    
    for key in @grouping_pairs
      keys.push key

    keys

  @closing_types : ->
    values = []    
    for key in @grouping_pairs
      values.push @grouping_pairs[key]

    values

  @opening_type_for : (type) ->
    if @grouping_pairs[type]? then @grouping_pairs[type] else null

  @to_regexp_str : ->
    set_to_regex (to_set())

  @to_set : ->
    evaluate(@root)

  evaluate : (node) ->
    switch node
      when UnaryOperator, BinaryOperator
        switch node.operator
          when "negate"
            TwitterCldr.UnicodeRegex.valid_regexp_chars.subtract( evaluate (node.child) )
          when "union", "pipe"
            evaluate (node.left).union (evaluate (node.right))
          when "dash"
            evaluate (node.left).difference (evaluate (node.right))
          when "ampersand"
            evaluate (node.left).intersection (evaluate (node.right))  
          
      else
        if node?
          node.to_set
        else
          new TwitterCldr.RangeSet []
    