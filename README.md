# chiasm-links

[![Build Status](https://travis-ci.org/chiasm-project/chiasm-links.svg)](https://travis-ci.org/chiasm-project/chiasm-links)

Data binding between Chiasm components.

This is a Chiasm plugin that implements both unidirectional and bidirectional data binding between properties within Chiasm components. It uses a domain specific language (DSL) to express data binding links between two components, like this:

  * Unidirectional  `myComponent.myPropertyA -> myOtherComponent.myPropertyB`
  * Bidirectional  `myComponent.myPropertyA <-> myOtherComponent.myPropertyB`

To see unidirectional data binding in action, take a look at this [Chiasm Foundation Example](http://bl.ocks.org/curran/b4aa88691528c0f0b1fa). In this example, dragging the X in the B box causes the X in the C box to update. This linkage is set up by chiasm-links. Here's what the Chiasm configuration fragment looks like that sets up a binding from the `lineWidth` property of component with alias `B` to the `lineWidth` property of component with alias `C`:

```json
"links": {
  "plugin": "links",
  "state": {
    "bindings": [
      "B.lineWidth -> C.lineWidth"
    ]
  }
}
```

To see bidirectional data binding in action, take a look at this [Map & Globe Example](http://bl.ocks.org/curran/01aa2685f083b6c1b9fb). In this example, the binding expression

```
leafletMap.center <-> d3Globe.center
```

sets up bidirectional data binding such that panning in either map representation updates the other accordingly.

Deep equality checking is required for bidirectional data binding, so be cautious when using this feature on properties that may potentially be large data structures (e.g. data tables).
