
import {test} from 'cypress/support/todolist_supp_pages'
describe('My first test (title checking)', () => {
  it('Visits the initial project page', () => {
    cy.visit('/')
    cy.title().should('equal','ToDoList')
  })
})


describe('Input in the begining should have value null', () => {
  it('Visits the initial value of input of list', () => {
    test.initalInputValueIsNull();
  })
})

describe('Input in the list should  null', () => {
  it('Visits the initial input of list', () => {
    test.initalToDoListIsVoid();
  })
})

describe('Footer shoud be null in the beginning', () => {
  it('Visits the initial footer', () => {
    test.footerIsNULL();
  })
})

describe('Footer/input after first interaction within',() => {
  it('Visits the input after abc entering into and testing if footer has been appeared',() => {
    test.footerAfterFirstInteraction();
  })
})
