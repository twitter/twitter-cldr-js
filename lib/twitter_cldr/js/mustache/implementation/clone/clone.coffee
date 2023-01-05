with_data_isolation = (data) -> (fn) ->
  original = TwitterCldr.data
  TwitterCldr.data = data
  result = fn()
  TwitterCldr.data = original
  result

get_with_data_isolation = (data) -> (target, property_key, receiver) ->
  isolate_data = with_data_isolation(data)

  isolate_data(->
    result = Reflect.get(target, property_key, receiver)

    if typeof result == 'function'
      fn = result

      result = (args...) -> isolate_data(-> Reflect.apply(fn, target, args))

    result
  )

proxy_or_primitive = (value, handlers) ->
  if value instanceof Object
    new Proxy(value, handlers)
  else
    value

TwitterCldr.clone = (data) ->
  if !data
    throw new Error('Cannot create a clone with no data')

  get = get_with_data_isolation(data)
  isolate_data = with_data_isolation(data)

  proxy_or_primitive(
    root,
    get: (target, property_key, receiver) ->
      switch property_key
        when 'set_data'
          return -> throw new Error('Cannot set data on a TwitterCldr clone')
        else
          isolate_data(
            -> proxy_or_primitive(
              Reflect.get(target, property_key, receiver), {
                get,
                apply: (args...) ->
                  isolate_data(
                    -> Reflect.apply(args...)
                  )
                construct: (args...) ->
                  isolate_data(
                    -> proxy_or_primitive(Reflect.construct(args...), { get })
                  )
              }
            )
          )
    set: () -> throw new Error('Cannot set properties on a TwitterCldr clone')
  )
