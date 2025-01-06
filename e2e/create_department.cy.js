const testData = {
  username: '*****',
  password: '*****',
  departmentName: 'Test Department',
  url: 'https://carbonm-uat.cedarsdigital.io/',
};


// 定義登入共用函式
Cypress.Commands.add('login', (username, password) => {
  cy.visit(testData.url);
  cy.get('#username').type(username);
  cy.get('#password').type(password);
  cy.get('button[type="submit"]').click();
});

// 定義部門建立共用函式
Cypress.Commands.add('attemptCreateDepartment', (departmentName, errorMsg = 'This department already exists. Please enter a new department name.') => {
  cy.get('input[data-testid="new_dept_name"]').type(departmentName);
  cy.get('button[data-testid="ok_btn"]').then(($btn) => {
    if ($btn.is(':disabled')) {
      cy.get('p[class="chakra-text css-0"]').should('contain', errorMsg).then(() => {
        cy.log(`部門名稱 "${departmentName}" 已存在，生成新名稱`);
        cy.get('input[data-testid="new_dept_name"]').clear();
      });
    } else {
      cy.wrap($btn).click();
      cy.get('p[class="chakra-text css-os2hgt"]').should('contain', 'Your department has been successfully created!');
      cy.get('button[class="chakra-button css-1aegpk2"]').click();
      cy.get('td[class="table_cell__HzHwi table_firstRowCell__IFizZ css-xumdn4"]').first();
      cy.get('td[class="table_cell__HzHwi table_firstRowCell__IFizZ css-xumdn4"]').eq(1).should('contain', departmentName);
    }
  });
});

describe('建立新部門', () => {
  it('建立成功或動態重新輸入名稱', () => {
    const generateDepartmentName = () => `${testData.departmentName}${Math.floor(Math.random() * 1000)}`;
    let departmentName = generateDepartmentName();

    // 登入
    cy.login(testData.username, testData.password);

    // 瀏覽至部門管理頁面
    cy.get('button[data-testid="ok_btn"]').click();
    cy.get('a[href="/account-management?boundaryId=4c7eaa97-50ea-4b05-85e0-972546edfd2c"]').click();
    cy.get('button[class="chakra-button css-dcuucc"]').click();

    // 嘗試建立部門
    cy.attemptCreateDepartment(testData.departmentName);

    // 如果名稱重複，再次嘗試
    cy.attemptCreateDepartment(departmentName);
  });
});
