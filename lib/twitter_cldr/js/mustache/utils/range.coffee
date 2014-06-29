# Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0

class TwitterCldr.Range
	constructor : (@first, @last) ->
		@size = @last - @first + 1

	to_array : ->
		[@first..@last]

	includes : (number) ->
		number >= @first and number <= @last