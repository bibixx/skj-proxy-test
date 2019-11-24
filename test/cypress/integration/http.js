const { tests } = require('../utils/common');

describe('HTTP', function() {
  beforeEach(() => {
    cy.visitHttp();
  })

  tests();
});
