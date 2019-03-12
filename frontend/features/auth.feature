Feature: Authentication
    Scenario: Realizar login
        Given Eu estou na pagina de login
        When Eu digito o email "test@test.com"
        And Eu digito a senha "test"
        And Eu clico submit
        Then Eu devo ver o botao de logout

    Scenario: Realizar login password errado
        Given Eu estou na pagina de login
        When Eu digito o email "test@test.com"
        And Eu digito a senha "teste"
        And Eu clico submit
        Then Eu devo ver o erro de senha
