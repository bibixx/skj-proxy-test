const { resolve: resolvePath } = require('url');

Cypress.Commands.add("visitHttp", (url = '/') => {
  cy.visit(
    resolvePath(Cypress.env('HTTP_BASE'), url),
  )
});

Cypress.Commands.add("visitHttps", (url = '/') => {
  cy.visit(
    resolvePath(Cypress.env('HTTPS_BASE'), url),
  )
});
