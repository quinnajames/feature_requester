describe("Given Feature model implementation", () => {
  beforeEach(() => {
    this.testFeature = new Feature("Title", "Description", "Client A", 99,
      "01/24/2018", "Policies", null);
  });
  it("should pass on correct parameters when creating a new entry", () => {
    expect(this.testFeature.id).not.toBeTruthy();
    expect(this.testFeature.title()).toEqual("Title");
    expect(this.testFeature.description()).toEqual("Description");
    expect(this.testFeature.client()).toEqual("Client A");
    expect(this.testFeature.priority()).toEqual(99);
    expect(this.testFeature.target_date()).toEqual("01/24/2018");
    expect(this.testFeature.product_area()).toEqual("Policies");

  });
  it("should create client_priority as combination of client and priority", () => {
    expect(this.testFeature.client_priority()).toEqual("Client A_99");
  });
  it("should create client CSS class", () => {
    expect(this.testFeature.clientClass()).toEqual("clienta");
  })
  afterEach(() => {
    this.testFeature = null;
  });
});

describe("Given FormViewModel implementation", () => {
  beforeEach(() => {
    this.testFormVM = new FormViewModel();
  });
  it("should have the correct client options, and no more", () => {
    expect(this.testFormVM.clientOptions).toEqual(['Client A', 'Client B', 'Client C']);
  });
  it("should have the correct product options, and no more", () => {
    expect(this.testFormVM.productOptions).toEqual(['Policies', 'Billing', 'Claims', 'Reports']);
  });
    describe("Given populateNewFeature is called", () => {
      beforeEach(() => {
        this.newFeature = this.testFormVM.populateNewFeature();
      });
      it("should put the proper parameters on the feature", () => {
        expect(this.newFeature.title()).toEqual("");
        expect(this.newFeature.description()).toEqual("");
        // Priority will need to be changed later
        expect(this.newFeature.priority()).toEqual(99);
      });
      it("should have no errors on the feature", () => {
        expect(this.testFormVM.isValidFeature(this.newFeature)).toBeTruthy();
      });
    });
     describe("Given extendFeature implementation", () => {
        beforeEach(() => {
          this.reallyLongTitle = `Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet,
           consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore
            et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum
            exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi
            consequatur?`
          this.reallyLongDescription = this.reallyLongTitle + this.reallyLongTitle
          + this.reallyLongTitle + this.reallyLongTitle + this.reallyLongTitle;
          this.badPriority = this.testFormVM.extendFeature(new Feature(
            "", "", "Client A", "x", "01/24/2018", "Policies", null
          ));
          this.badTitle = this.testFormVM.extendFeature(new Feature(
            this.reallyLongTitle, "", "Client A", "x", "01/24/2018", "Policies", null
          ));
          this.badDescription = this.testFormVM.extendFeature(new Feature(
            "", this.reallyLongDescription, "Client A", "x", "01/24/2018", "Policies", null
          ));
        });
        it("should error on a non-integer priority", () => {
          expect(this.testFormVM.isValidFeature(this.badPriority)).toBeFalsy();
        });
        it("should error on a title above 100 characters", () => {
          expect(this.testFormVM.isValidFeature(this.badTitle)).toBeFalsy();
        });
        it("should error on a description above 500 characters", () => {
          expect(this.testFormVM.isValidFeature(this.badDescription)).toBeFalsy();
        });
  });

  afterEach(() => {
    this.testFormVM = null;
  });
});


describe("Given FeatureViewModel implementation", () => {
  beforeEach(() => {
    this.featureVM = new FeatureViewModel();
  });
  it("should start by not showing the form", () => {
    expect(this.featureVM.showForm()).toEqual(false);
  });
  describe("Given toggleForm implementation", () => {
    it("should toggle the form from false to true", () => {
      this.featureVM.showForm(false);
      this.featureVM.toggleForm();
      expect(this.featureVM.showForm()).toBe(true);
    });
    it("should toggle the form from true to false", () => {
      this.featureVM.showForm(true);
      this.featureVM.toggleForm();
      expect(this.featureVM.showForm()).toBe(false);
    });
  })


    describe("given addOnSuccess implementation", () => {
      beforeEach(() => {
        this.addData = JSON.parse(TestResponses.addFeature.success.responseText);
        this.featureVM.features = ko.observableArray([]);
        spyOn(this.featureVM, 'makeFeatureFromServerData').and.callThrough();
        this.featureVM.addOnSuccess(addData);
      })
      it('should call makeFeatureFromServerData', () => {
        expect(this.featureVM.makeFeatureFromServerData).toHaveBeenCalledWith(addData);
      })
      it('should add a feature to the features array', () => {
        expect(this.featureVM.features().length).toEqual(1);
        expect(this.featureVM.features()[0] instanceof Feature).toBeTruthy();
      })
      it('should give the new feature the correct title', () => {
        expect(this.featureVM.features()[0].title()).toEqual('Feature');
      })
      it('should give the new feature the correct client_priority', () => {
        expect(this.featureVM.features()[0].client_priority()).toEqual('Client A_13');
      })
    })

  describe("Given mapJSONToFeatures implementation", () => {
    beforeEach(() => {
          this.testFeatureJSON = JSON.parse(JSON.stringify({
      "features": [
        {
          "client": "Client B",
          "client_priority": "Client B_1",
          "description": "bluh",
          "id": 2,
          "priority": 1,
          "product_area": "Policies",
          "target_date": "Wed, 24 Jan 2018 00:00:00 GMT",
          "title": "Test another feature"
        },
        {
          "client": "Client A",
          "client_priority": "Client A_1",
          "description": "This is important.",
          "id": 1,
          "priority": 1,
          "product_area": "Policies",
          "target_date": "Thu, 25 Jan 2018 00:00:00 GMT",
          "title": "New feature"
        }
      ]
    }));
      this.mappedFeature = this.featureVM.mapJSONToFeatures(this.testFeatureJSON)[0];
    });
    it("should return a feature", () => {
      expect(this.mappedFeature instanceof Feature).toBe(true);
      expect(this.mappedFeature instanceof Array).toBe(false);
    })
    it("should return a feature with correct priority", () => {
      expect(this.mappedFeature.priority()).toEqual(1);
    });
    it("should return a feature with correct client_priority", () => {
      expect(this.mappedFeature.client_priority()).toEqual("Client B_1");
    });
  })
  describe("Given makeFeatureFromServerData implementation", () => {
    beforeEach(() => {
      this.serverData = JSON.parse(TestResponses.addFeature.success.responseText);
      this.serverFeature = this.featureVM.makeFeatureFromServerData(this.serverData);
    });
    it("should return a feature", () => {
        expect(this.serverFeature instanceof Feature).toBe(true);
        expect(this.serverFeature instanceof Array).toBe(false);
    });
    it("should return a feature with correct priority", () => {
      expect(this.serverFeature.priority()).toEqual(13);
    });
    it("should return a feature with correct client_priority", () => {
      expect(this.serverFeature.client_priority()).toEqual("Client A_13");
    });
    it("should ignore what the server says about client_priority", () => {
      expect(this.serverFeature.client_priority()).not.toEqual("Client A_7");
    });
  })


    describe("Given requestAddFeature implementation", () => {
      beforeEach(() => {
        this.testRequestFeature = new Feature("Feature", "stuff", "Client A", 13,
            "01/24/2018", "Policies", null); // not testing id
      })
      it('should call the success function', () => {
        this.featureVM.requestAddFeature(this.testRequestFeature);
        spyOn($, 'ajax').and.callFake(function(e) {
          return $.Deferred().resolve(TestResponses.addFeature.success).promise();
        });
        this.featureVM.addOnSuccess = jasmine.createSpy("addOnSuccess spy").and.callThrough();
        this.featureVM.requestAddFeature(this.testRequestFeature);
        expect(this.featureVM.addOnSuccess).toHaveBeenCalledWith(TestResponses.addFeature.success);
      })
    })


    describe("Given getNewFeature implementation", () => {
      beforeEach(() => {
        // mock VM
        this.mockFormVM = new (function() {
          var self = this;
          self.newFeature = new Feature("Feature", "stuff", "Client A", 13,
              "01/24/2018", "Policies", null);
          self.newFeature.errors = {
            showAllMessages: function() {
              return "Did not validate";
            }
          }
          self.isValidFeature = function (feature) {
            return true;
          }
        })();
        this.gnfReturn = this.featureVM.getNewFeature(this.mockFormVM);
      })
      it('should return an object when feature validates', () => {
        expect(this.gnfReturn instanceof Object).toBe(true);
      });
      it('should have correct static title', () => {
        // Function unwraps these attributes; they're not ko observables anymore.
        expect(this.gnfReturn.title).toEqual('Feature');
      })
      it('should have correct calculated client_priority', () => {
        expect(this.gnfReturn.client_priority).toEqual('Client A_13');
      })
       it('should return FALSE when feature does not validate', () => {
        this.mockFormVM.isValidFeature = function(feature) {
          return false;
        }
        this.gnfReturnFalse = this.featureVM.getNewFeature(this.mockFormVM);
        expect(this.gnfReturnFalse).toEqual(false);
      })
    })

    // todo
    xdescribe("given addFeature implementation", () => {
      describe("when getNewFeature returns a valid feature", () => {
        beforeEach(() => {
          this.testFeatureAF = new Feature("Title", "Description", "Client A", 99,
                        "01/24/2018", "Policies", null);
          this.featureVM.getNewFeature = jasmine.createSpy("getNewFeature spy")
            .and.callFake(function (form) { return this.testFeatureAF });
          spyOn(this.featureVM, 'requestAddFeature');
          this.featureVM.addFeature();
        });
        it('should call requestAddFeature with the test feature', () => {
          expect(this.featureVM.requestAddFeature).toHaveBeenCalledWith(this.testFeatureAF);
        });
      })
    })

    xdescribe("given sortFeatures implementation", () => {

    })


  afterEach(() => {
    this.featureVM = null;
  });
});
