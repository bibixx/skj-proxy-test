const hasTestFinished = testName => (w) => w.tests.successes.includes(testName) || w.tests.fails.includes(testName);

const tests = () => {
  const testCase = (testName) => {
    cy.waitUntil(() => cy.window().then(hasTestFinished(testName)));

    cy.window()
      .then((win) => {
        expect(win.tests.successes).to.include(testName);
      })
  }

  it('should load image', function() {
    cy.window()
      .then((win) => {
        expect(win.imageError).to.be.false;
      })
  })

  it('should load video', function() {
    cy.window()
      .then((win) => {
        expect(win.videoError).to.be.false;
      })
  })

  const methods = ['POST', 'GET', 'PUT', 'DELETE', 'PATCH'];
  methods.forEach((method) => {
    it(`should make ${method} request`, () => {
      const body = { testing: 'true' };
      cy.request(method, `/${method.toLowerCase()}`, body).should((response) => {
        expect(response.body.method).to.equal(method.toLowerCase())
        expect(response.body.body).to.deep.equal(body)
      })
    });
  })

  it('should pass headers', () => {
    testCase('Content Type');
  });

  it('cache data', () => {
    testCase('Cache');
  });

  it('should allow concurrent connections', () => {
    testCase('Delay');
  });

  it.skip('highlight bomba', () => {
    cy.get('[data-testid="bomba"]').should('have.length', 1)
  });

  it.skip('highlight muchomor', () => {
    cy.get('[data-testid="muchomor"]').should('have.length', 1)
  });

  it.skip('highlight atomowa', () => {
    cy.get('[data-testid="atomowa"]').should('have.length', 1)
  });

  it.skip('highlight twarda woda', () => {
    cy.get('[data-testid="twarda woda"]').should('have.length', 1)
  });
}

module.exports = {
  tests
}
