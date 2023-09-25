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

const createProductForm = (categories = []) => {
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
    category_id: fields.string({
      label: "Category",
      required: false,
      errorAfterField: true,
      cssClasses: {
        label: ["form-label"],
      },
      widget: widgets.select(),
      choices: categories,
    }),
  });
};

const createRegistrationForm = () => {
  return forms.create({
    username: fields.string({
      required: true,
      errorAfterField: true,
      cssClasses: {
        label: ["form-label"],
      },
    }),
    email: fields.string({
      required: true,
      errorAfterField: true,
      cssClasses: {
        label: ["form-label"],
      },
      validators: [validators.email()],
    }),
    password: fields.password({
      required: true,
      errorAfterField: true,
      cssClasses: {
        label: ["form-label"],
      },
    }),
    confirm_password: fields.password({
      required: true,
      errorAfterField: true,
      cssClasses: {
        label: ["form-label"],
      },
      validators: [validators.matchField("password")],
    }),
  });
};

const createLoginForm = () => {
  return forms.create({
    email: fields.string({
      required: true,
      errorAfterField: true,
      cssClasses: {
        label: ["form-label"],
      },
    }),
    password: fields.password({
      required: true,
      errorAfterField: true,
      cssClasses: {
        label: ["form-label"],
      },
    }),
  });
};

const createSearchForm = (categories = []) => {
  return forms.create({
    name: fields.string({
      required: false,
      errorAfterField: true,
      cssClasses: {
        label: ["form-label"],
      },
    }),
    min_cost: fields.string({
      required: false,
      errorAfterField: true,
      cssClasses: {
        label: ["form-label"],
      },
      validators: [validators.integer()],
    }),
    max_cost: fields.string({
      required: false,
      errorAfterField: true,
      cssClasses: {
        label: ["form-label"],
      },
      validators: [validators.integer()],
    }),
    category_id: fields.string({
      label: "Category",
      cssClasses: {
        label: ["form-label"],
      },
      required: false,
      errorAfterField: true,
      widget: widgets.select(),
      choices: categories,
    }),
  });
};

module.exports = {
  createProductForm,
  bootstrapField,
  createRegistrationForm,
  createLoginForm,
  createSearchForm,
};
