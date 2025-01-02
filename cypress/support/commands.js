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

const attachFileHandler = () => { //criei uma variável que é uma função
   cy.get('#file').selectFile('cypress/fixtures/example.json')
}

Cypress.Commands.add('createNote', (note, attachFile = false) => {
   cy.visit('/notes/new')
   cy.get('#content').type(note)

   if (attachFile) {
      attachFileHandler()
   }
   cy.contains('button', 'Create').click()

   cy.contains('.list-group-item', note).should('be.visible')
})

Cypress.Commands.add('editNote', (note, newNoteValue, attachFile = false) => {
   cy.intercept('GET', '**/notes/**').as('getNote')

   cy.contains('.list-group-item', note).click()
   cy.wait('@getNote')

   cy.get('#content').clear()
   cy.get('#content').type(newNoteValue)

   if (attachFile) {
      attachFileHandler()
   }
   cy.contains('button', 'Save').click()

   cy.contains('.list-group-item', newNoteValue).should('be.visible')
   cy.contains('.list-group-item', note).should('not.exist')
})

Cypress.Commands.add('deleteNote', (note) => {
   cy.contains('.list-group-item', note).click()
   cy.contains('button', 'Delete').click()

   cy.get('.list-group-item')
      .its('length')
      .should('be.at.least', 1)
   cy.contains('.list-group-item', note)
      .should('not.exist')
})

Cypress.Commands.add('fillSettingsFormAndSubmit', () =>{
   cy.visit('/settings')
   cy.get('#storage').type('1')
   cy.get('#name').type('Mary Jane')
   cy.iframe('.card-field iframe')
      .as('iframe')
      .find('[name="cardnumber"]')
      .type('4242424242424242')
   cy.get('@iframe')
      .find('[name="exp-date"]')
      .type('1271')
   cy.get('@iframe')
      .find('[name="cvc"]')
      .type('123')
   cy.get('@iframe')
      .find('[name="postal"]')
      .type('12345')
   cy.contains('button', 'Purchase').click()
})