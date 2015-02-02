#Bootstrap 3 Form Builder

##What's this?

A Drag-and-drop form builder for [twitter bootstrap](http://twitter.github.com/bootstrap/). 

##Where can I see it in action?

The initial form builder is hosted on github pages [here](http://minikomi.github.io/Bootstrap-Form-Builder/).

### Adding new form elements

* In the [js/data/ folder](https://github.com/jolamar/Bootstrap-Form-Builder/tree/gh-pages/assets/js/data/) are json files, each of which corresponds to a tab in the form builder.
* If you just want to add a new element you need to:
  - describe it in one of these files
  - create a corresponding template in the [templates/snippet directory](https://github.com/jolamar/Bootstrap-Form-Builder/tree/gh-pages/assets/js/templates/snippet)
  - add the template to [snippet-templates.js](https://github.com/jolamar/Bootstrap-Form-Builder/blob/gh-pages/assets/js/templates/snippet/snippet-templates.js)
* If you want to add a new tab, you'll also need to adjust the [app.js file](https://github.com/jolamar/Bootstrap-Form-Builder/blob/gh-pages/assets/js/app.js) to make sure the tab is loaded.

### Credits to Adam Moore (minikomi) for the [initial repo](https://github.com/minikomi/Bootstrap-Form-Builder)
