var TestResponses = {
  addFeature: {
    success: {
      status: 200,
      responseText: '{"client":"Client A","description":"stuff","id":7,"priority":13,"product_area":"Policies","target_date":"01/24/2018","title":"Feature"}'
    },
    failure: {
      status: 500,
      responseText: '500 Internal Server Error'
    }
  },
  deleteFeature: {
    success: {
      status: 200,
      responseText: '{"id": 3}'
    },
    failure: {
      status: 500,
      responseText: '500 Internal Server Error'
    }
  }
};
