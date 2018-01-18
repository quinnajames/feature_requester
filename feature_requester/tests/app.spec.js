describe('Hello world', function () {
  it('says hello', function () {
    expect('Hello world!').toEqual('Hello world!');
  });
});

describe("Given Feature implementation", () => {
  beforeEach(() => {
    this.testFeature = new Feature("Title", "Description", "Client A", 99,
      "01/24/2018", "Policies", null);
  });
  it("when creating a new entry, it should pass on correct parameters", () => {
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


describe("Given Feature implementation", () => {
  beforeEach(() => {
    this.testFeature = new Feature("Title", "Description", "Client A", 99,
      "01/24/2018", "Policies", null);
  });
  it("when creating a new entry, it should pass on correct parameters", () => {
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
    this.testFeature = null;
  });
});
