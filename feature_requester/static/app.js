Feature = function(title, description, client, client_priority,
      target_date, product_area, id) {
  let self = this;
  self.title = ko.observable(title);
  self.description = ko.observable(description);
  self.client = ko.observable(client);
  self.client_priority = ko.observable(client_priority);
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
      return 'clienta';
    }
  })
}

FeatureViewModel = function() {
  let self = this;

  self.features = ko.observableArray([]);
  self.clientOptions = ['Client A', 'Client B', 'Client C'];
  self.productOptions = ['Policies', 'Billing', 'Claims', 'Reports'];

  self.showForm = ko.observable();
  self.showForm(false);

  self.populateNewFeature = function() {
    return new Feature("", "", "Client A", self.features().length + 1,
      "01/24/2018", "1", null);
  }

  self.newFeature = self.populateNewFeature();

  self.mapJSONToFeatures = function(json) {
    console.log(`json: ${json.features}`);
    console.log(json.features);
    var featureModels = $.map(json.features, function(item) {
      return new Feature(item.title, item.description, item.client,
        item.client_priority, item.target_date, item.product_area, item.id);
    });
    return featureModels;
  }

  self.updateFeatures = function() {
    $.getJSON('/features', (input) => {
      self.features(self.mapJSONToFeatures(input));
    });
  }

  self.toggleForm = function() {
    console.log("toggleForm");
    self.showForm(!self.showForm());
  }

  self.makeFeatureFromData = function() {
    return new Feature({
      title: data.title,
      description: data.description,
      client: data.client,
      client_priority: data.client_priority,
      target_date: data.target_date,
      product_area: data.product_area,
      id: data.id
    });
  }

  self.addFeature = function() {
    let data = {
      'title': self.newFeature.title(),
      'description': self.newFeature.description(),
      'client': self.newFeature.client(),
      'client_priority': self.newFeature.client_priority(),
      'target_date': self.newFeature.target_date(),
      'product_area': self.newFeature.product_area()
    };
    return $.ajax({
      url: '/add',
      contentType: 'application/json',
      type: 'POST',
      data: JSON.stringify(data),
      dataType: 'json',
      success: (serverData) => {
        //console.log(serverData);
        self.features.unshift(makeFeatureFromData(serverData));
      },
      error: () => {
        return console.log("Failed to save");
      }
    });
  }

  // on load
  self.updateFeatures();
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
