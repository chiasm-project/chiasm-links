var expect = require("chai").expect
var ChiasmLinks = require("./index");
var ChiasmComponent = require("chiasm-component");
var Chiasm = require("chiasm");

function SimpleComponent(){
  return new ChiasmComponent({
    x: 5
  });
}

function initChiasm(){
  var chiasm = new Chiasm();
  chiasm.plugins.simpleComponent = SimpleComponent;
  chiasm.plugins.links = ChiasmLinks;
  return chiasm;
}

describe("ChiasmLinks", function() {

  it("should implement unidirectional data binding", function (done) {
    var chiasm = initChiasm();
    chiasm.setConfig({
      a: {
        plugin: "simpleComponent",
        state: {
          x: 100
        }
      },
      b: {
        plugin: "simpleComponent"
      },
      links: {
        plugin: "links",
        state: {
          bindings: ["a.x -> b.x"]
        }
      }
    }).then(function (){
      chiasm.getComponent("b").then(function (b){
        b.when("x", function (x){
          if(x === 100){

            // If we are here, then the change successfully propagated from a to b.
            done();
          }
        });
      });
    });
  });

  it("should clear listeners for unidirectional data binding", function (done) {
    var chiasm = initChiasm();
    chiasm.setConfig({
      a: {
        plugin: "simpleComponent",
        state: {
          x: 100
        }
      },
      b: {
        plugin: "simpleComponent"
      },
      links: {
        plugin: "links",
        state: {
          bindings: ["a.x -> b.x"]
        }
      }
    }).then(function (){
      chiasm.getComponent("b").then(function (b){
        b.when("x", function (x){
          if(x === 100){
            // If we are here, then the change successfully propagated from a to b.

            // Now we'll remove the bindings.
            chiasm.getComponent("links").then(function (links){
              links.bindings = [];

              // At this point, the bindings listeners should be removed.
              // setTimeout is needed here to queue our code to run
              // AFTER the model.when handler for "bindings" has executed.
              setTimeout(function (){

                // Make a change in a.x and make sure it doesn't propagate to b.x.
                chiasm.getComponent("a").then(function (a){
                  a.x = 500;
                  setTimeout(function (){
                    expect(b.x).to.equal(100);
                    done();
                  }, 0);
                });
              }, 0);
            });
          }
        });
      });
    });
  });

  it("should implement bidirectional data binding", function (done) {
    var chiasm = initChiasm();
    chiasm.setConfig({
      a: {
        plugin: "simpleComponent",
        state: {
          x: 100
        }
      },
      b: {
        plugin: "simpleComponent"
      },
      links: {
        plugin: "links",
        state: {
          bindings: ["a.x <-> b.x"]
        }
      }
    }).then(function (){
      chiasm.getComponent("b").then(function (b){
        b.when("x", function (x){
          if(x === 100){
            // If we are here, then the change successfully propagated from a to b.

            // This change should propagate from b to a.
            b.x = 500;
          }
        });
      });

      chiasm.getComponent("a").then(function (a){
        a.when("x", function (x){
          if(x === 500){
            // If we are here, then the change successfully propagated from b to a.
            done();
          }
        });
      });
    });
  });

  it("should clear listeners for bidirectional data binding", function (done) {
    var chiasm = initChiasm();
    chiasm.setConfig({
      a: {
        plugin: "simpleComponent",
        state: {
          x: 100
        }
      },
      b: {
        plugin: "simpleComponent"
      },
      links: {
        plugin: "links",
        state: {
          bindings: ["a.x <-> b.x"]
        }
      }
    }).then(function (){
      chiasm.getComponent("b").then(function (b){
        b.when("x", function (x){
          if(x === 100){
            // If we are here, then the change successfully propagated from a to b.

            // Now we'll remove the bindings.
            chiasm.getComponent("links").then(function (links){
              links.bindings = [];

              // At this point, the bindings listeners should be removed.
              // setTimeout is needed here to queue our code to run
              // AFTER the model.when handler for "bindings" has executed.
              setTimeout(function (){

                // Make a change in a.x and make sure it doesn't propagate to b.x.
                chiasm.getComponent("a").then(function (a){
                  a.x = 500;
                  setTimeout(function (){
                    expect(b.x).to.equal(100);

                    // Make a change in b.x and make sure it doesn't propagate to a.x.
                    b.x = 99;
                    setTimeout(function (){
                      expect(a.x).to.equal(500);
                      done();
                    }, 0);
                  }, 0);
                });
              }, 0);
            });
          }
        });
      });
    });
  });
});
