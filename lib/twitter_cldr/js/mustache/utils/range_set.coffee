# Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0

class TwitterCldr.RangeSet
	# An integer set, implemented under the hood with ranges. The idea is
	# that it's more efficient to store sequential data in ranges rather
	# than as single elements. By definition, RangeSets contain no duplicates.
	constructor : (ranges) ->
		@ranges = []
		for range in ranges
			if range instanceof TwitterCldr.Range
				@ranges.push (new TwitterCldr.Range range.first, range.last)
			else
				@ranges.push (new TwitterCldr.Range range, range)
		@flatten()

	@from_array : (array) ->
		@rangify(array)

	# Turns an array of integers into ranges. The "compress" option indicates
	# wether or not to turn isolated elements into zero-length ranges or leave
	# them as single elements.
	#
	# For example:
	# rangify([1, 2, 4], false) returns [1..2, 4..4]
	# rangify([1, 2, 4], true) returns [1..2, 4]
	@rangify : (list, compress = false) ->
		last_item = null

		sorted_list = list.sort( (a,b) ->
			a - b
		)
		sub_lists = []
		for item in sorted_list
			if last_item?
				diff = item - last_item

				if diff > 0
					if diff is 1
						sub_lists[sub_lists.length-1].push item
					else
						sub_lists.push [item]
					last_item = item
			else
				sub_lists.push [item]
				last_item = item

		sub_lists.map ((sub_list) ->
			if compress && sub_list.length is 1
				sub_list[0]
			else
				new TwitterCldr.Range sub_list[0], sub_list[sub_list.length-1]
		)


	to_array : (compress = false) -> 
		if compress
			@ranges.map ((range) ->
				if range.first is range.last
					range.first
				else
					TwitterCldr.Utilities.clone(range)
			)
		else
			TwitterCldr.Utilities.clone(@ranges)

	to_full_array : ->
		result = []
		
		for range in @ranges
			if range instanceof TwitterCldr.Range
				result = result.concat range.to_array()
			else
				result = result.concat range
		# TODO - Check all the concats.
		result		

	to_set : ->
		new TwitterCldr.Set (@to_full_array)

	includes : (obj) ->
		# TODO - Make at least 5 test cases here. (4 + 1 for false)
		if obj instanceof TwitterCldr.Range
			for range in @ranges
				# range may either be a TwitterCldr.Range or a number TODO - Verify this.
				if range instanceof TwitterCldr.Range #obj is a Range, range is a Range
					return true if range.first <= obj.first && range.last >= obj.last
				else if obj.size == 1 # obj is a Range of size 1, range is numeric
					return true if range is obj.first
		else
			for range in @ranges
				if range instanceof TwitterCldr.Range #obj is a numeric, range is a Range
					return true if range.includes obj
				else
					return true if range is obj # obj is a numeric, range is numeric

		false

	is_empty : ->
		@ranges.length == 0
			
	union : (range_set) ->
		new TwitterCldr.RangeSet range_set.ranges.concat(@ranges)

	intersection : (range_set) ->
		new_ranges = []
		for their_range in range_set.ranges
			for our_range in @ranges
				if @does_overlap their_range, our_range
					if intrsc = @find_intersection(their_range, our_range)
						new_ranges.push intrsc

		new TwitterCldr.RangeSet new_ranges


	subtract : (range_set) ->
		return (new TwitterCldr.RangeSet(@ranges)) if range_set.is_empty()
		remaining = TwitterCldr.Utilities.clone(range_set.ranges)
		current_ranges = TwitterCldr.Utilities.clone(@ranges)

		while their_range = remaining.shift()
			new_ranges = []

			for our_range in current_ranges
				if @does_overlap their_range, our_range
					new_ranges = new_ranges.concat @find_subtraction(their_range, our_range)
				else 
					new_ranges.push our_range

			current_ranges = new_ranges

		new TwitterCldr.RangeSet(new_ranges)

	
	# symmetric difference (the union without the intersection)
	# http://en.wikipedia.org/wiki/Symmetric_difference
	difference : (range_set) ->
		@union(range_set).subtract(@intersection(range_set))

	first : (range) ->
		if range instanceof TwitterCldr.Range then range.first else range

	last : (range) ->
		if range instanceof TwitterCldr.Range then range.last else range

	flatten : ->
		if @ranges.length <= 1
			return	

		sorted_ranges = @ranges.sort ((a,b) ->
			a_representative = (if a instanceof TwitterCldr.Range then a.first else a)
			b_representative = (if b instanceof TwitterCldr.Range then b.first else b)
			# TODO - Remove all instances of this this. It should all be ranges.
			if a_representative > b_representative
				return 1
			else if a_representative < b_representative
				return -1
			else return 0	
		)

		new_ranges = [sorted_ranges[0]]
		for range in sorted_ranges
			previous_range = new_ranges.pop()

			if (@are_adjacent previous_range, range) or (@does_overlap previous_range, range)
				new_ranges.push (new TwitterCldr.Range(TwitterCldr.Utilities.min([range.first, previous_range.first]),TwitterCldr.Utilities.max([range.last, previous_range.last])))
			else 
				new_ranges.push (previous_range)
				new_ranges.push (range)
		
		@ranges = new_ranges

	# returns true if range1 and range2 are within 1 of each other
	are_adjacent : (range1, range2) ->
		(range1.last is range2.first - 1) || (range2.first is range1.last + 1)

	does_overlap : (range1, range2) -> 
		((range1.last >= range2.first and range1.last <= range2.last) or
		(range1.first >= range2.first and range1.first <= range2.last) or
		(range1.first <= range2.first and range1.last >= range2.last))

	find_intersection : (range1, range2) ->
		# range2 entirely contains range1
		if range2.first <= range1.first and range1.last <= range2.last
			TwitterCldr.Utilities.clone(range1)
		else if range1.last >= range2.first and range1.last <= range2.last
			new TwitterCldr.Range range2.first, range1.last
		else if range1.first >= range2.first and range1.first <= range2.last
			new TwitterCldr.Range range1.first, range2.last
		else if range1.first <= range2.first and range1.last >= range2.last
			new TwitterCldr.Range(TwitterCldr.Utilities.max([range1.first, range2.first]),TwitterCldr.Utilities.min([range1.last, range2.last]))



	# subtracts range1 from range2 (range2 - range1)
	find_subtraction : (range1, range2) ->
		# case: range1 contains range2 entirely (also handles equal case)
		results = null
		if range1.first <= range2.first and range2.last <= range1.last
			results = []
		# case: range1 comes in the middle
		else if range2.first <= range1.first and range2.last >= range1.last
			results = [(new TwitterCldr.Range range2.first, range1.first - 1), (new TwitterCldr.Range range1.last + 1, range2.last)]
		# case: range1 trails
		else if range2.last >= range1.first and range1.last >= range2.last
			results = [new TwitterCldr.Range range2.first, range1.first - 1]
		# case: range1 leads
		else if range1.last >= range2.first && range1.first <= range2.first
			results = [new TwitterCldr.Range range1.last + 1, range2.last]

		filtered_results = []
		for range in results 
			if range.first <= range.last
				filtered_results.push range

		filtered_results
