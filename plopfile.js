const viewGenerator = require("./plop-templates/view/prompt");

module.exports = plop => {
	plop.setGenerator("view", viewGenerator);
};
