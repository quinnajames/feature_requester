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
  afterEach(() => {
    this.testFeature = null;
  });
});
