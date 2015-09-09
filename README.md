# chiasm-links

[![Build Status](https://travis-ci.org/chiasm-project/chiasm-links.svg)](https://travis-ci.org/chiasm-project/chiasm-links)

Data binding between Chiasm components.

This is a Chiasm plugin that does data binding between Chiasm components. It
uses a domain specific language (DSL) to express data binding links between two components, like this:

`myComponent.myPropertyA -> myOtherComponent.myPropertyB`

To see this in action, take a look at this [Chiasm Foundation Example](http://bl.ocks.org/curran/b4aa88691528c0f0b1fa). In this example, dragging the X in the B box causes the X in the C box to update. This linkage is set up by chiasm-links. Here's what the Chiasm configuration fragment looks like that sets up a binding from the `lineWidth` property of component with alias `B` to the `lineWidth` property of component with alias `C`:

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
