import { faker } from '@faker-js/faker/locale/en'

describe('CRUD', () => {
   it('CRUD is a note', () => {
      const noteDescription = faker.lorem.words(4)

      cy.intercept('GET', '**/notes').as('getNotes')
      cy.sessionLogin()

      cy.createNote(noteDescription)
      cy.wait('@getNotes')

      const updateNotesDescription = faker.lorem.words(4)
      const attachFile = true

      cy.editNote(noteDescription, updateNotesDescription, attachFile)
      cy.wait('@getNotes')

      cy.deleteNote(updateNotesDescription)
      cy.wait('@getNotes')
   })
})
