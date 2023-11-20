const { it } = require("mocha");

describe('Acesso ao sistema de teste', () => {
  beforeEach(() => {
    cy.visit('https://www.saucedemo.com/');
    cy.get('#user-name').type('standard_user');
    cy.get('#password').type('secret_sauce');
    cy.get('#login-button').click();
  });

  it('Validar a tela de login', () => { 
    cy.title().should('eq', 'Swag Labs');
  });  

  it('Preencher o formulário de login', () => {
    cy.get('.app_logo').should('contain', 'Swag Labs');
  });

  //pesquisa / filtro por menor preco
  it('Filtrar produtos por menor preço', () => {
    cy.get('.product_sort_container').select('Price (low to high)');
    cy.get('.inventory_item_price').should('contain', '$7.99');
  });


  //Verificando se os produtos foram adicionados
  it('Adicionar produtos ao carrinho', () => {
    // Encontrar o elemento com o texto "Sauce Labs Backpack" e buscar o botão "Add to cart"
    cy.AdicionarProduto('Sauce Labs Backpack');
    cy.wait(2000);
    //adicionar outro produto
    cy.AdicionarProduto('Sauce Labs Bolt T-Shirt');
    cy.wait(2000);
  
  });


  it('validar o carrinho de compras', () => {
    cy.wait(2000);
    cy.AdicionarProduto('Sauce Labs Backpack');
    cy.wait(2000);
    //adicionar outro produto
    cy.AdicionarProduto('Sauce Labs Bolt T-Shirt');
    cy.wait(2000);
    cy.get('.shopping_cart_link').click();
    cy.get('.inventory_item_name').should('contain', 'Sauce Labs Backpack');
    cy.get('.inventory_item_name').should('contain', 'Sauce Labs Bolt T-Shirt');
    //validar os precos de cada item
    cy.get('.inventory_item_price').should('contain', '$29.99');
    cy.get('.inventory_item_price').should('contain', '$15.99');
  });

  it('finalizar a compra', () => {
    cy.AdicionarProduto('Sauce Labs Backpack');
    cy.wait(2000);
    //adicionar outro produto
    cy.AdicionarProduto('Sauce Labs Bolt T-Shirt');
    cy.wait(2000);
    cy.get('.shopping_cart_link').click();
    cy.wait(2000);
    cy.get('#checkout').click();
    //validar se estou na pagina de checkout
    cy.get('.title').should('contain', 'Checkout: Your Information');
    //preencher o formulario
    cy.get('#first-name').type('Teste');
    cy.get('#last-name').type('Teste');
    cy.get('#postal-code').type('93800000');
    //clicar no botao continue
    cy.get('#continue').click();
    //validar se estou na pagina de checkout overview
    cy.get('.title').should('contain', 'Checkout: Overview');
    //validar os produtos
    cy.get('.inventory_item_name').should('contain', 'Sauce Labs Backpack');
    cy.get('.inventory_item_name').should('contain', 'Sauce Labs Bolt T-Shirt');
    //validar os precos de cada item
    cy.get('.inventory_item_price').should('contain', '$29.99');
    cy.get('.inventory_item_price').should('contain', '$15.99');
    //validar taxa
    cy.get('.summary_tax_label').should('contain', '$3.68');
    //validar o valor total
    cy.get('.summary_total_label').should('contain', '$49.66');
    //clicar no botao finish
    cy.get('#finish').click();
    //validar se foi processado
    cy.get('.complete-header').should('contain', 'Thank you for your order!');
  });

  //reutilizar o código para add ao carrinho
  Cypress.Commands.add('AdicionarProduto', (produto) => {
    cy.get('.inventory_item_name')
    .contains(produto)
    .parents('.inventory_item_label')
    .siblings('.pricebar')
    .find('.btn_inventory')
    .click();
  });


  
});