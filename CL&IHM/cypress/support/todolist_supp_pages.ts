import { Test } from "mocha";

interface Testing{
  initalInputValueIsNull:() =>  Testing
  initalToDoListIsVoid:()=>Testing
  footerIsNULL:() => Testing
  footerAfterFirstInteraction:()=>Testing
}

export class Testing_class implements Testing{
  initalInputValueIsNull() {
    cy.visit('/')
    cy.get('.new-todo').should('have.value','')
    return this;
  }
  initalToDoListIsVoid(){
    cy.get('.todo-list').should('be.empty')
    return this;
  }
  footerIsNULL(){
    cy.visit('/')
    cy.get('.underFooter').should('not.exist')
    return this
  }
  footerAfterFirstInteraction(){
    cy.get('.new-todo').type('abc')
    cy.get('.new-todo').type('{enter}',{force:true})
    cy.get('.underFooter').should(($el)=>{
      expect($el).to.have.length(1)
      cy.get('new-todo').should(($el2)=>{
        expect($el2).to.have.length(1)
        expect($el2).to.have.value('abc')
        }
      )
    })

    return this
  }
}
export const test=new Testing_class();
