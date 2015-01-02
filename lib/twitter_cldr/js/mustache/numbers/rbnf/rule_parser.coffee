# Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0

class TwitterCldr.RBNFRuleParser extends TwitterCldr.Parser
  do_parse : (options = {}) ->
    @switch([])

  switch : (list) -> #TODO - This name was "switch". Figure it out.
    @[@current_token().type](list)

  equals : (list) ->
    contents = @descriptor(@current_token())
    list.push(new TwitterCldr.RBNFSubstitution("equals", contents, 2))
    @next_token("equals")
    @switch(list)

  left_arrow : (list) ->
    contents = @descriptor(@current_token())
    list.push(new TwitterCldr.RBNFSubstitution("left_arrow", contents, 2))
    @next_token("left_arrow")
    @switch(list)

  right_arrow : (list) ->
    contents = @descriptor(@current_token())
    sub = new TwitterCldr.RBNFSubstitution("right_arrow", contents, 2)
    @next_token("right_arrow")

    # handle the ">>>" case

    if @current_token().type == "right_arrow"
      sub.length += 1
      @next_token("right_arrow")

    list.push(sub)
    @switch(list)

  plural : (list) ->
    sub = new TwitterCldr.RBNFPlural.from_string(@current_token().value)
    list.push(sub)
    @next_token("plural")
    @switch(list)

  plaintext : (list) ->
    @add_and_advance(list)

  open_bracket : (list) ->
    @add_and_advance(list)

  close_bracket : (list) ->
    @add_and_advance(list)

  semicolon : (list) ->
    list

  add_and_advance : (list) ->
    list.push(@current_token())
    @next_token(@current_token().type)
    @switch(list)

  descriptor : (token) ->
    @next_token(token.type)
    contents = []

    while @current_token().type isnt token.type
      contents.push(@current_token())
      @next_token(@current_token().type)

    contents

