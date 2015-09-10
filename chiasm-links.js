(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.ChiasmLinks = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
// chiasm-links.js
// v0.2.1
// github.com/chiasm-project/chiasm-links
//
// This is a Chiasm plugin that does data binding between Chiasm components. It
// uses a special domain specific language (DSL) to express data binding links 
// between two components:
//
//  * Unidirectional  `myComponent.myPropertyA -> myOtherComponent.myPropertyB`
//  * Bidirectional  `myComponent.myPropertyA <-> myOtherComponent.myPropertyB`
var ChiasmComponent = (typeof window !== "undefined" ? window['ChiasmComponent'] : typeof global !== "undefined" ? global['ChiasmComponent'] : null);

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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[1])(1)
});