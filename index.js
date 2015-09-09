// This is a Chiasm plugin that does data binding between Chiasm components. It
// uses a special domain specific language (DSL) to express data binding links 
// between two components:
//
//  * Unidirectional  `myComponent.myPropertyA -> myOtherComponent.myPropertyB`
//  * Bidirectional (planned, not implemented)  `myComponent.myPropertyA <-> myOtherComponent.myPropertyB`
function Links(chiasm) {

  var my = ChiasmComponent({
    bindings: []
  });

  var sourceListeners = [];

  my.when("bindings", function (bindings){

    var oldSourceListeners = sourceListeners;
    sourceListeners = [];

    // Clear out the listeners for the old bindings.
    oldSourceListeners.forEach(function (_){
      chiasm.getComponent(_.sourceAlias).then(function (sourceComponent){
        sourceComponent.cancel(_.listener);
      });
    });

    // Add listeners for the new bindings.
    bindings.forEach(function(bindingExpr){

      // Parse the binding expression of the form
      // "sourceAlias.sourceProperty -> targetAlias.targetProperty"
      var parts = bindingExpr.split("->").map(function(str){ return str.trim(); }),
          source = parts[0].split("."),
          sourceAlias = source[0],
          sourceProperty = source[1],
          target = parts[1].split("."),
          targetAlias = target[0],
          targetProperty = target[1];

      // Retreive the source and target components.
      chiasm.getComponent(sourceAlias).then(function(sourceComponent){
        chiasm.getComponent(targetAlias).then(function(targetComponent){
        
          // TODO report errors for missing components.

          // Add a reactive function that binds the source to the target.
          var listener = sourceComponent.when(sourceProperty, function(value){
            if(targetComponent[targetProperty] !== value){
              targetComponent[targetProperty] = value;
            }
          });

          // Keep track of the added listener so it can be removed later.
          sourceListeners.push({
            sourceAlias: sourceAlias,
            listener: listener
          });
        });
      });
    });
  });

  return my;
}
