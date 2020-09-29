const hbs = require("hbs");
const wax = require("wax-on");


function setupHBS() {
  wax.on(hbs.handlebars);
  wax.setLayoutPath("./views/layouts");

  var helpers = require("handlebars-helpers")({
    handlebars: hbs.handlebars
  });  
}

module.exports = {
    setupHBS
}