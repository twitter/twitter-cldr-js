# Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0

class TwitterCldr.TerritoriesContainment
  @territories_data = `{{{territories_data}}}`

  @contains: (parent_code, child_code) ->
    @validate_territory(parent_code)
    @validate_territory(child_code)

    immediate_children = @children(parent_code)

    contains = false

    if child_code in immediate_children
      contains = true
    else
      for immediate_child in immediate_children
        if @contains(immediate_child, child_code)
          contains = true
          break

    contains

  @parents: (territory_code) ->
    @validate_territory(territory_code)
    @parents_data[territory_code]

  @children: (territory_code) ->
    @validate_territory(territory_code)
    @territories_data[territory_code] || []

  @prepare_parents_data: ->
    data = {}

    for territory, children of @territories_data
      data[territory] = [] unless territory of data

      for child in children
        data[child] = [] unless child of data
        data[child].push(territory)

    data

  @parents_data = @prepare_parents_data()

  @validate_territory: (territory_code) ->
    throw "unknown territory code" unless territory_code of @parents_data
