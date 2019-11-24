const { tests } = require('../utils/common');

describe('HTTPS', function() {
  beforeEach(() => {
    cy.visitHttps();
  })

  tests();
});
