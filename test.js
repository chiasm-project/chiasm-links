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
            chiasm.getComponent("links").then(function (links){
              links.bindings = [];
              setTimeout(function (){
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
});
