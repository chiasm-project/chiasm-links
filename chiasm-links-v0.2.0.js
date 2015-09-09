(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.ChiasmLinks = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
// chiasm-links.js
// v0.2.0
// github.com/chiasm-project/chiasm-links
//
// This is a Chiasm plugin that does data binding between Chiasm components. It
// uses a special domain specific language (DSL) to express data binding links 
// between two components:
//
//  * Unidirectional  `myComponent.myPropertyA -> myOtherComponent.myPropertyB`
//  * Bidirectional (planned, not implemented)  `myComponent.myPropertyA <-> myOtherComponent.myPropertyB`
var ChiasmComponent = (typeof window !== "undefined" ? window['ChiasmComponent'] : typeof global !== "undefined" ? global['ChiasmComponent'] : null);
function ChiasmLinks(chiasm) {

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
            targetComponent[targetProperty] = value;
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

module.exports = ChiasmLinks;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[1])(1)
});