Shared = function() {
  let self = this;
  self.sortFeatures = function(set) {
    return set.sort(function(a, b) {
      return a.client() === b.client() ?
        a.priority() > b.priority() ? 1 : -1 :
        a.client() > b.client() ? 1 : -1;
    })
  }


  self.getHighestPossiblePriority = function(set, client) {
    console.log("set:")
    console.log(set());
    console.log("client:")
    console.log(client);
    clientSet = ko.utils.arrayFilter(set(), (i) => {
      //console.log(i.client());
      return i.client() === client;
    })
    console.log("clientSet:")
    console.log(clientSet);
    if (clientSet.length > 0)
    {
      return self.sortFeatures(clientSet)[clientSet.length-1].priority()+1;
    }
    else
    {
      return self.sortFeatures(ko.observableArray([]));
    }
  }
}


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
    if (self.client()) {
      let css = self.client().toLowerCase().replace(/ /g, '');
      console.log(css);
      return css;
    } else {
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
    feature.title.extend({
      maxLength: 100
    });
    feature.description.extend({
      maxLength: 500
    });
    feature.priority.extend({
      digit: true
    }); // This accepts all integers.
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
  self.shared = new Shared();

  console.log(self.formVM);
  // 'Global'
  self.features = ko.observableArray([]);
  self.getPriorityOptions = function(list, client) {
    return ko.computed(() => {
      let options = [];
      let min = 1;
      let max = self.shared.getHighestPossiblePriority(list, client);
      for (let x = min; x <= max; x++) {
        options.push(x.toString());
      }
      return options;
    })
  }


  self.showForm = ko.observable();
  self.showForm(false);

  self.toggleForm = function() {
    console.log("toggleForm");
    console.log(`changing ${self.showForm()} to ${!self.showForm()}`)
    self.showForm(!self.showForm());
  }


  self.parseTargetDate = function(date) {
    if (date.indexOf('/') > 0) {
      // Don't break a date that already comes in the correct form
      // But remove leading zeros
      let input = date.split("/");
      let output = "";
      output += parseInt(input[0],10).toString();
      output += '/';
      output += parseInt(input[1],10).toString();
      output += '/';
      output += parseInt(input[2],10).toString();
      return output;
    }
    else {
      let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      let input = date.split(" ")
      if (months.indexOf(input[2]) < 0) return "Invalid date";
      else {
        let output = "";
        output += (months.indexOf(input[2]) + 1).toString(); // e.g. Jan is 0 + 1
        output += "/";
        output += input[1];
        output += "/";
        output += input[3];
        return output;
      }
    }
  }

  self.makeFeatureFromServerData = function(data) {
    console.log("about to parse date:")
    console.log(data.target_date);
    return new Feature(
      data.title,
      data.description,
      data.client,
      data.priority,
      self.parseTargetDate(data.target_date),
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

  self.loadFeatures = function() {
    $.getJSON('/features', (input) => {
      self.features(self.mapJSONToFeatures(input));
    });
  }

  // Combined


  self.getNewFeature = function(form) {
    if (!form.isValidFeature(form.newFeature)) {
      form.newFeature.errors.showAllMessages();
      return false;
    } else {
      return {
        'title': form.newFeature.title(),
        'description': form.newFeature.description(),
        'client': form.newFeature.client(),
        'priority': form.newFeature.priority(),
        'client_priority': form.newFeature.client_priority(),
        'target_date': form.newFeature.target_date(),
        'product_area': form.newFeature.product_area()
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
        dataType: 'json'
      })
      .done((serverData) => self.addOnSuccess(serverData))
      .fail(() => console.log("Failed to save"))
  }

  self.addFeature = function() {
    let gnf = self.getNewFeature(self.formVM);
    if (!gnf) {
      return console.log("Form invalid");
    } else {
      console.log(gnf);
      self.requestAddFeature(gnf);
    }
  }

  //Removes feature in place
  self.removeFeatureFromList = function(id, list) {
    list.remove((item) => {
      return item.id === id;
    })
  }

  self.deleteOnSuccess = function(id) {
    self.removeFeatureFromList(id, self.features);
  }

  self.requestDeleteFeature = function(id) {
    return $.ajax({
        url: '/delete',
        contentType: 'application/json',
        type: 'POST',
        data: ko.toJSON(id),
        dataType: 'json'
      })
      .done((response) => {
        console.log(response);
        self.deleteOnSuccess(response.id);
        console.log("Sent item remove request");
      })
      .fail(() => {
        console.log("Failed to delete")
      });
  }






  self.insertElement = function(set, feature) {
    let client = feature.client();
    let id = feature.id;
    console.log(`id:`);
    console.log(id);
    let priority = feature.priority();
    let client_priority = feature.client_priority();

    ko.utils.arrayForEach(set(), (el) => {
      if (el.client() === client && el.priority() >= priority) {
        el.priority(el.priority() + 1);
        // I have to manually recalc this with this method
        //el.client_priority(el.client() + "_" + el.priority());
      }
    })
    set.push(feature);
    return set().indexOf(ko.utils.arrayFirst(set(), (x) => {
      return x.id === id;
    }));
  }



  // on load
  self.loadFeatures();
  console.log(self.features());
  self.features = self.shared.sortFeatures(self.features);
  console.log('self.features:')
  console.log(self.features());
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
