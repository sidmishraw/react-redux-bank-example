#==========================================================================================
# Defining an object as simple as this
# In this case, the calls to stack function generate objects -- that are stacks.
# Since these stacks are objects (reference types), they are different.
# Similar to JS's object definition using function syntax.
stack = ->
  do (obj = undefined) ->
    obj =
      array: []
      index: -1
      push: (value) -> obj.array[obj.index += 1] = value
      pop: ->
        do (value = obj.array[obj.index]) ->
          obj.array[obj.index] = undefined
          obj.index -= 1 if obj.index >= 0
          value
      isEmpty: -> obj.index < 0

#==========================================================================================
# To make this singleton
stackSingleton = do (obj = undefined) ->
  obj =
    array: []
    index: -1
    push: (value) -> obj.array[obj.index += 1] = value
    pop: ->
      do(value = obj.array[obj.index]) ->
        obj.array[obj.index] = undefined # removal of the last element, LIFO
        obj.index -= 1 if obj.index >= 0
        value # implicit return
    isEmpty: -> obj.index < 0
    length: -> obj.index + 1 # writing length: obj.index + 1 gives an error because, when coffeescript tries
                             # to evaluate the expression, `obj` is not defined
                             # hence we need to put them inside a function.
                             # When the function is invoked, `obj` is defined and the function
                             # closes over `obj` and is able to report the correct length.

#==========================================================================================
# Methods vs functions
#==========================================================================================

# odd and even are function, pure functions since they only use their arguments
{
  odd: (x) -> if x? and x%2 is 0 then false else true,
  even: (x) -> if x? and x%2 is 0 then true else false
}
# methods reference the object itself within them, just like in case of the stack example

#==========================================================================================
# Implementating encapsulation - intelligence encapsulation
#==========================================================================================

# The stackEncapsulated uses the `do` to create an environment
# and holds the array and index in the environment rather than in the object.
###
Now, the environment `E` is defined as:
E = {array:[], index: -1, ..:parent}
whereas, `E'`, the environment of the `stack` is defined as:
E'= {obj: undefined, ..:parent}
So, E is better encapsulated than E'
###
stackEncapsulated = ->
  do (array=[], index=-1) ->
    push: (x) -> array[index += 1] = x
    pop: ->
      do(value = array[index]) ->
        array[index] = undefined
        index -= 1 if index >= 0
        value
    isEmpty: -> index < 0
    length: -> index + 1

#==========================================================================================

# Singleton encapsulated stack object

stackEncapsulatedSingleton = do(array = [], index = -1) ->
  push: (x) -> array[index += 1] = x
  pop: ->
    do(value = array[index]) ->
      array[index] = undefined
      index -= 1 if index >= 0
      value
  isEmpty: -> index < 0
  length: -> index + 1

#==========================================================================================
###
Problems with closures
###
#==========================================================================================

###
Queuemaker
~~~~~~~~~~~~
A simple queue factory that returns a queue object.
Each queue object is unique when made by the Queuemaker.
###
Queuemaker = ->
  do (queue = undefined) -> # Environment, the queue object returned is bound to this environment
    queue =
      array: []
      head: 0
      tail: -1
      pushTail: (x) -> queue.array[queue.tail += 1] = x
      pullHead: do (value = undefined) ->
        ->
          unless queue.isEmpty()
            value = queue.array[queue.head]
            queue.array[queue.head] = undefined
            queue.head += 1
            value
      isEmpty: -> queue.head > queue.tail

#==========================================================================================
###
Testing: Extension
~~~~~~
###
queue1 = Queuemaker() # first queue
queue1.pushTail("Hey")
queue1.pushTail("there")

###
extend
~~~~~~~~
Prepares the object for extension

@param {object} obj The extended object, basically a copy of the object to be extended
@param {object} extensions The object to be extended

@returns {object} The object ready to be extended. It is a copy of the extensions object
###
extend = (obj, extensions) ->
  obj[key] = value for key, value of extensions # comprehension, Note the usage of `of` instead
                                                # of `in`. `in` is used in case of arrays
                                                # and `of` is used in case of objects.
  obj

copyOfQueue = extend({}, queue1)
copyOfQueue.array = (element for element in queue1.array)

queue1 isnt copyOfQueue # => true

###
The problem with closure
###
copyOfQueue.pullHead() # => copyOfQueue.pullHead()
                       # => 'Hey'

###
coffee> queue1
{ 
  array: [ undefined, 'there' ],
  head: 1,
  tail: 1,
  pushTail: [Function: pushTail],
  pullHead: [Function],
  isEmpty: [Function: isEmpty] 
}

As can be seen, copyOfQueue was not a deep copy of queue1.
So, modification to copyOfQueue does modify queue1. 
###

###
Explanation of the closure mishap ~ Sid
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
In the line `Queuemaker = ->
  do (queue = undefined) -> (...)` 
The `do (queue = undefined) -> (...)` defines the environment `E`.
The queue name is bound to an object whose methods refer to the environment E.
The extend and extend_ functions when try to make copies by copying over properties
from the queue1 object, they also copy over the closures over `queue` object in environment E.
Hence, the copied objects, although have different object IDs, their methods internally refer to
the same `queue` object in environment E.

This problem doesn't arise in case we call the QueueMaker to create new queues -
new environment E is generated for each call.

```coffeescript
coffee> extend_({})
------> extend_ = (extension) ->
.......   if typeof extension is "object"
.......     if extension.length?
.......       do (arr = undefined) ->
.......         arr = value for value in extension # an array
.......     else
.......       do(obj = undefined) ->
.......         obj = {}
.......         obj[key] = extend_(value) for key, value of extension
.......         obj
.......   else
.......     extension
[Function: extend_]
coffee> extend_(queue1)
{ array: [ undefined, 'there' ],
  head: 1,
  tail: 1,
  pushTail: [Function: pushTail],
  pullHead: [Function],
  isEmpty: [Function: isEmpty] }
coffee> ss = extend_(queue1)
{ array: [ undefined, 'there' ],
  head: 1,
  tail: 1,
  pushTail: [Function: pushTail],
  pullHead: [Function],
  isEmpty: [Function: isEmpty] }
coffee> ss.pushTail("hhh")
'hhh'
coffee> ss
{ array: [ undefined, 'there' ],
  head: 1,
  tail: 1,
  pushTail: [Function: pushTail],
  pullHead: [Function],
  isEmpty: [Function: isEmpty] }
coffee> queue1
{ array: [ undefined, 'there', 'hhh' ],
  head: 1,
  tail: 2,
  pushTail: [Function: pushTail],
  pullHead: [Function],
  isEmpty: [Function: isEmpty] }
coffee> 
```
###
