const forms = require("forms");
const fields = forms.fields;
const widgets = forms.widgets;
const validators = forms.validators;

var bootstrapField = function (name, object) {
  if (!Array.isArray(object.widget.classes)) {
    object.widget.classes = [];
  }
  if (object.widget.classes.indexOf("form-control") === -1) {
    object.widget.classes.push("form-control");
  }

  var label = object.labelHTML(name);
  var error = object.error
    ? '<div class="alert alert-error help-block">' + object.error + "</div>"
    : "";

  var validationClass = object.value && !object.error ? "has-success" : "";
  validationClass = object.error ? "has-error" : validationClass;

  var widget = object.widget.toHTML(name, object);
  return (
    '<div class="form-group ' +
    validationClass +
    '">' +
    label +
    widget +
    error +
    "</div>"
  );
};

const createProductForm = () => {
  return forms.create({
    name: fields.string({
      required: true,
      errorAfterField: true,
      cssClasses: {
        label: ["form-label"],
      },
    }),
    price: fields.string({
      required: true,
      errorAfterField: true,
      cssClasses: {
        label: ["form-label"],
      },
      validators: [validators.integer()],
    }),
    quantity: fields.string({
      required: true,
      errorAfterField: true,
      cssClasses: {
        label: ["form-label"],
      },
      validators: [validators.integer()],
    }),
    description: fields.string({
      required: true,
      errorAfterField: true,
      cssClasses: {
        label: ["form-label"],
      },
    }),
    image: fields.string({
      required: false,
      widget: widgets.hidden(),
    }),
  });
};

module.exports = { createProductForm, bootstrapField };
