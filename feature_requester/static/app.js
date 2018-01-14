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
    let css = self.client().toLowerCase().replace(/ /g,'');
    console.log(css);
    return css;
  })
}

FeatureViewModel = function() {
  let self = this;

  self.features = ko.observableArray([]);
  self.newFeature = populateNewFeature();
  self.clientOptions = ['Client A', 'Client B', 'Client C'];
  self.productOptions = ['Policies', 'Billing', 'Claims', 'Reports'];

  self.showForm = ko.observable();
  self.showForm(false);


  function populateNewFeature() {
    return new Feature("", "", "", self.features().length + 1,
      "", "", null);
  }

  self.toggleForm = function() {
    console.log("toggleForm");
    self.showForm(!self.showForm());
  }
}

let fvm = new FeatureViewModel();

// For dry-run purposes
fvm.features.push(new Feature("Feature", "A really important feature",
"Client A", 1, "04/01/2019", "Business", 2));
fvm.features.push(new Feature("Feature 2", "Perhaps a bit less important",
"Client A", 2, "06/17/2019", "Business", 1));
fvm.features.push(new Feature("New car", "Just literally a new car",
"Client B", 1, "06/17/2019", "Products", 3));
fvm.features.push(new Feature("Claim report", "Client claims there is a report",
"Client C", 1, "06/17/2019", "Claims", 3));
fvm.features.push(new Feature("Report claim", "Client reports there is a claim",
"Client C", 2, "06/17/2019", "Reports", 3));
ko.applyBindings(fvm);
