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
}

FeatureViewModel = function() {
  let self = this;
  self.features = ko.observableArray([]);
  self.newFeature = populateNewFeature();


  function populateNewFeature() {
    return new Feature("", "", "", self.features.length + 1,
      "", "", null);
  }
  //on load
  console.log(self.features())
}

let fvm = new FeatureViewModel();

// For dry-run purposes
fvm.features.push(new Feature("Feature", "A really important feature",
"Client A", 1, "4/1/2019", "Business", 2));
fvm.features.push(new Feature("Feature 2", "Perhaps a bit less important",
"Client A", 2, "6/17/2019", "Business", 1));
ko.applyBindings(fvm);
