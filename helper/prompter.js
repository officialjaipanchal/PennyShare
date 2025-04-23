const fs = require("fs");
const mustache = require("mustache");
const path = require("path");

class Prompter {
  constructor(templateFile) {
    this.templatePath = path.resolve(__dirname, `../templates/${templateFile}`);
    this.template = fs.readFileSync(this.templatePath, "utf-8");
  }

  render(context) {
    return mustache.render(this.template, context);
  }
}

module.exports = Prompter;
