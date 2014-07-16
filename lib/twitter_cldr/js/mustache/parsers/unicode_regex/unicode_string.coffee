# Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0

class TwitterCldr.UnicodeString extends TwitterCldr.Component
	constructor : (@codepoints) ->
		super

	to_set : ->
		# If the number of codepoints is greater than 1, treat them as a
    # group (eg. multichar string). This is definitely a hack in that
    # it means there has to be special logic in RangeSet that deals
    # with data types that aren't true integer ranges. I can't think
    # of any other way to support multichar strings :(

    if @codepoints.length > 1 # TODO - Verify this.
      new TwitterCldr.RangeSet([new TwitterCldr.Range @codepoints, @codepoints])
    else
      new TwitterCldr.RangeSet([new TwitterCldr.Range @codepoints[0], @codepoints[0]])

  @to_regex_str : ->
  	cps = (if @codepoints instanceof Array then @codepoints else [@codepoints])
  	array_to_regex (cps)

  	