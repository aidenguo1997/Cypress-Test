const testData = {
  username: '*****',
  password: '*****',
  departmentName: 'Test Department',
  url: 'https://carbonm-uat.cedarsdigital.io/'
};

// 定義登入共用函式
Cypress.Commands.add('login', (username, password) => {
  cy.visit(testData.url);
  cy.get('#username').type(username);
  cy.get('#password').type(password);
  cy.get('button[type="submit"]').click();
});

// 測試登入功能
describe('登入功能', () => {
  it('登入成功', () => {
    cy.login(testData.username, testData.password);
    // 驗證登入是否成功 (可以根據登入後的特定元素檢查)
    cy.url().should('include', '/select-boundary'); 
    cy.get('header[id="chakra-modal--header-:r0:"]').should('contain', 'Select Boundary'); 
    cy.get('button[data-testid="ok_btn"]').click();
  });
});
