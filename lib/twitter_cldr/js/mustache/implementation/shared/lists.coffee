# Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0

class TwitterCldr.ListFormatter
  @data :->
    TwitterCldr.get_data().ListFormatter

  formats: ->
    @constructor.data().formats

  format: (list) ->
    if @formats()[list.length.toString()]?
      this.compose(@formats()[list.length.toString()], list)
    else
      this.compose_list(list)

  compose_list: (list) ->
    result = this.compose(@formats().end || @formats().middle || "", [list[list.length - 2], list[list.length - 1]])

    if list.length > 2
      for i in [3..list.length]
        format_key = if i == list.length then "start" else "middle"
        format_key = "middle" unless @formats()[format_key]?
        result = this.compose(@formats()[format_key] || "", [list[list.length - i], result])

    result

  compose: (format, elements) ->
    elements = (element for element in elements when element?)

    if elements.length > 1
      result = format.replace(/\{(\d+)\}/g, '$1')

      if TwitterCldr.Settings.is_rtl()
        result = TwitterCldr.Bidi.from_string(result, {"direction": "RTL"}).reorder_visually().toString()

      result.replace(/(\d+)/g, (match) ->
        elements[parseInt(match)]
      )
    else
      elements[0] || ""
