// chiasm-links.js
// github.com/chiasm-project/chiasm-links
//
// This is a Chiasm plugin that does data binding between Chiasm components. It
// uses a special domain specific language (DSL) to express data binding links 
// between two components:
//
//  * Unidirectional  `myComponent.myPropertyA -> myOtherComponent.myPropertyB`
//  * Bidirectional  `myComponent.myPropertyA <-> myOtherComponent.myPropertyB`
var ChiasmComponent = require("chiasm-component");

function ChiasmLinks(chiasm) {

  var model = ChiasmComponent({
    bindings: []
  });

  var listeners = [];

  model.when("bindings", function (bindings){

    // Clear out the listeners for the old bindings.
    listeners.forEach(function (d){
      chiasm.getComponent(d.alias).then(function (component){
        component.cancel(d.listener);
      });
    });
    listeners = [];

    // Add listeners for the new bindings.
    bindings.forEach(function(bindingExpr){

      // Determine whether the binding is unidirectional or bidirectional.
      var bidirectional = false;
      var operator = "->";
      if(bindingExpr.indexOf("<->") != -1){
        bidirectional = true;
        operator = "<->";
      }

      // Parse the binding expression of the form
      // "sourceAlias.sourceProperty -> targetAlias.targetProperty" or
      // "sourceAlias.sourceProperty <-> targetAlias.targetProperty"
      var parts = bindingExpr.split(operator).map(function(str){ return str.trim(); }),
          source = parts[0].split("."),
          sourceAlias = source[0],
          sourceProperty = source[1],
          target = parts[1].split("."),
          targetAlias = target[0],
          targetProperty = target[1];

      // Retreive the source and target components.
      chiasm.getComponent(sourceAlias).then(function(sourceComponent){
        chiasm.getComponent(targetAlias).then(function(targetComponent){

          // TODO write tests that cover this.
          if(bidirectional){

            // Bind source -> target
            listeners.push({
              alias: sourceAlias,
              listener: sourceComponent.when(sourceProperty, function(value){
                if(!deepEqual(targetComponent[targetProperty], value)){
                  targetComponent[targetProperty] = value;
                }
              })
            });

            // Bind target -> source
            listeners.push({
              alias: targetAlias,
              listener: targetComponent.when(targetProperty, function(value){
                if(!deepEqual(sourceComponent[sourceProperty], value)){
                  sourceComponent[sourceProperty] = value;
                }
              })
            });

          } else {

            // Bind source -> target
            listeners.push({
              alias: sourceAlias,
              listener: sourceComponent.when(sourceProperty, function(value){
                
                // No check for equality here, because it could potentially be expensive,
                // e.g. the common use case of setting a data table via "loader.data -> vis.data".
                targetComponent[targetProperty] = value;
              })
            });
          }
        });
      });
    });
  });

  // This comparison logic is necessary to avoid an infinite loop in bidirectional data binding.
  function deepEqual(a, b){
    return JSON.stringify(a) === JSON.stringify(b);
  }

  return model;
}

module.exports = ChiasmLinks;
