Cypress.Commands.add('preencheEEnviaFormularioInscricao', (email, password) => {
  cy.intercept('GET', '**notes').as('getNotes')
  cy.visit('/signup')
  cy.get('#email').type(email)
  cy.get('#password').type(password, { log: false })
  cy.get('#confirmPassword').type(password, { log: false })
  cy.contains('button', 'Signup').click()
  cy.get('#confirmationCode').should('be.visible')
  cy.mailosaurGetMessage(Cypress.env('MAILOSAUR_SERVER_ID'), {
    sentTo: email,
  }).then((message) => {
    const confirmationCode = message.html.body.match(/\d{6}/)[0]
    cy.get('#confirmationCode').type(`${confirmationCode}{ enter }`)
    cy.wait('@getNotes')
  })
})

Cypress.Commands.add('guiLogin', (
  username = Cypress.env('USER_EMAIL'), //SE EU NÃO PASSAR UM NOVO DADO USO O ENV
  password = Cypress.env('USER_PASSWORD') //SE EU NÃO PASSAR UM NOVO DADO USO O ENV
) => {
  cy.intercept('GET', '**/notes').as('getNotes')
  cy.visit('/login')
  cy.get('#email').type(username)
  cy.get('#password').type(password, { log: false })
  cy.contains('button', 'Login').click()
  cy.wait('@getNotes')
})

Cypress.Commands.add('sessionLogin', (
  username = Cypress.env('USER_EMAIL'), //SE EU NÃO PASSAR UM NOVO DADO USO O ENV
  password = Cypress.env('USER_PASSWORD') //SE EU NÃO PASSAR UM NOVO DADO USO O ENV
) => {
  const login = () => cy.guiLogin(username, password)
  cy.session(username, login)
})