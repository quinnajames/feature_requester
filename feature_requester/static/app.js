Feature = function(title, description, client, priority,
      target_date, product_area, id) {
  let self = this;
  self.title = ko.observable(title)
  self.description = ko.observable(description)
  self.client = ko.observable(client);
  self.priority = ko.observable(priority);
  self.target_date = ko.observable(target_date);
  self.product_area = ko.observable(product_area);
  self.id = id;
  self.clientClass = ko.computed(function() {
    if(self.client()) {
      let css = self.client().toLowerCase().replace(/ /g,'');
      console.log(css);
      return css;
    }
    else {
      return 'defaultclient';
    }
  })
  // This will let us enforce a uniqueness constraint.
  self.client_priority = ko.pureComputed(function() {
    return self.client() + "_" + self.priority();
  })
}

FormViewModel = function() {
  let self = this;
  self.clientOptions = ['Client A', 'Client B', 'Client C'];
  self.productOptions = ['Policies', 'Billing', 'Claims', 'Reports'];



  self.extendFeature = function(feature) {
    feature.title.extend({maxLength: 100});
    feature.description.extend({maxLength: 500});
    feature.priority.extend({digit: true}); // This accepts all integers.
    return feature;
  }


  self.populateNewFeature = function() {
    // need like a global or subscribable for the default priority
    let newFeatureObj = new Feature("", "", "Client A", 99,
      "01/24/2018", "Policies", null);
      return self.extendFeature(newFeatureObj);
  }

  self.newFeature = self.populateNewFeature();

  self.newFeature.errors = ko.validation.group(self.newFeature);

  self.isValidFeature = function(feature) {
    feature.errors = ko.validation.group(feature);
    return feature.errors().length === 0;
  }
  console.log(self.newFeature);
}

FeatureViewModel = function() {
  let self = this;
  self.formVM = new FormViewModel();

  console.log(self.formVM);
  // 'Global'
  self.features = ko.observableArray([]);

    self.showForm = ko.observable();
    self.showForm(false);

    self.toggleForm = function() {
        console.log("toggleForm");
        console.log(`changing ${self.showForm()} to ${!self.showForm()}`)
        self.showForm(!self.showForm());
      }

      self.makeFeatureFromServerData = function(data) {
        return new Feature(
          data.title,
          data.description,
          data.client,
          data.priority,
          data.target_date,
          data.product_area,
          data.id
        );
      }


  // Display stuff
  self.mapJSONToFeatures = function(json) {
    console.log(`json: ${json.features}`);
    console.log(json.features);
    let featureModels = $.map(json.features, function(item) {
      return self.makeFeatureFromServerData(item);
    });
    // can convert date back to display date here
    console.log("featureModels:")
    console.log(featureModels);
    return featureModels;
  }

  self.updateFeatures = function() {
    $.getJSON('/features', (input) => {
      self.features(self.mapJSONToFeatures(input));
    });
  }

  // Combined


  self.getNewFeature = function() {
    if (!self.formVM.isValidFeature(self.formVM.newFeature)) {
      self.formVM.newFeature.errors.showAllMessages();
      return false;
    }
    else {
      return {
        'title': self.formVM.newFeature.title(),
        'description': self.formVM.newFeature.description(),
        'client': self.formVM.newFeature.client(),
        'priority': self.formVM.newFeature.priority(),
        'client_priority': self.formVM.newFeature.client_priority(),
        'target_date': self.formVM.newFeature.target_date(),
        'product_area': self.formVM.newFeature.product_area()
      };
    }
  }



  self.addOnSuccess = function(serverData) {
    console.log(serverData);
    self.features.unshift(self.makeFeatureFromServerData(serverData));
  }

    self.requestAddFeature = function(data) {
        return $.ajax({
          url: '/add',
          contentType: 'application/json',
          type: 'POST',
          data: JSON.stringify(data),
          dataType: 'json'})
          .done((serverData) => self.addOnSuccess(serverData))
          .fail(() => console.log("Failed to save"))
      }

    self.addFeature = function() {
      let gnf = self.getNewFeature();
      if (!gnf) {
        return console.log("Form invalid");
      }
      else {
        console.log(gnf);
        self.requestAddFeature(gnf);
      }
    }



  self.sortFeatures = function(array) {
    return array.sort(function (a, b) {
      return a.client() === b.client()
      ? a.priority() > b.priority() ? 1 : -1
      : a.client() > b.client() ? 1 : 1;
    })
  }

  // on load
  self.updateFeatures();
  self.features = self.sortFeatures(self.features);
}

let fvm = new FeatureViewModel();

// For dry-run purposes
// fvm.features.push(new Feature("Feature", "A really important feature",
// "Client A", 1, "04/01/2019", "Business", 2));
// fvm.features.push(new Feature("Feature 2", "Perhaps a bit less important",
// "Client A", 2, "06/17/2019", "Business", 1));
// fvm.features.push(new Feature("New car", "Just literally a new car",
// "Client B", 1, "06/17/2019", "Products", 3));
// fvm.features.push(new Feature("Claim report", "Client claims there is a report",
// "Client C", 1, "06/17/2019", "Claims", 3));
// fvm.features.push(new Feature("Report claim", "Client reports there is a claim",
// "Client C", 2, "06/17/2019", "Reports", 3));
ko.applyBindings(fvm);
