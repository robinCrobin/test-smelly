const { UserService } = require('../src/userService');

const dadosUsuarioPadrao = {
  nome: 'Fulano de Tal',
  email: 'fulano@teste.com',
  idade: 25,
};

describe('UserService - Suíte de Testes Limpa', () => {
  let userService;

  beforeEach(() => {
    userService = new UserService();
    userService._clearDB();
  });

  test('deve criar usuário com id e status ativo por padrão', () => {
    // Arrange
    const { nome, email, idade } = dadosUsuarioPadrao;

    // Act
    const usuarioCriado = userService.createUser(nome, email, idade);

    // Assert
    expect(usuarioCriado).toMatchObject({
      nome,
      email,
      idade,
      isAdmin: false,
      status: 'ativo',
    });
    expect(usuarioCriado.id).toBeDefined();
  });

  test('deve buscar usuário por id existente', () => {
    // Arrange
    const usuarioCriado = userService.createUser(
      dadosUsuarioPadrao.nome,
      dadosUsuarioPadrao.email,
      dadosUsuarioPadrao.idade
    );

    // Act
    const usuarioBuscado = userService.getUserById(usuarioCriado.id);

    // Assert
    expect(usuarioBuscado).toMatchObject({
      id: usuarioCriado.id,
      nome: dadosUsuarioPadrao.nome,
      email: dadosUsuarioPadrao.email,
      status: 'ativo',
    });
  });

  test('deve desativar usuário comum', () => {
    // Arrange
    const usuarioComum = userService.createUser('Comum', 'comum@teste.com', 30);

    // Act
    const desativou = userService.deactivateUser(usuarioComum.id);
    const usuarioAtualizado = userService.getUserById(usuarioComum.id);

    // Assert
    expect(desativou).toBe(true);
    expect(usuarioAtualizado.status).toBe('inativo');
  });

  test('não deve desativar usuário administrador', () => {
    // Arrange
    const usuarioAdmin = userService.createUser('Admin', 'admin@teste.com', 40, true);

    // Act
    const desativou = userService.deactivateUser(usuarioAdmin.id);
    const usuarioAtualizado = userService.getUserById(usuarioAdmin.id);

    // Assert
    expect(desativou).toBe(false);
    expect(usuarioAtualizado.status).toBe('ativo');
  });

  test('deve gerar relatório com cabeçalho e usuários cadastrados', () => {
    // Arrange
    const usuario1 = userService.createUser('Alice', 'alice@email.com', 28);
    const usuario2 = userService.createUser('Bob', 'bob@email.com', 32);

    // Act
    const relatorio = userService.generateUserReport();

    // Assert
    expect(relatorio).toContain('--- Relatório de Usuários ---');
    expect(relatorio).toContain(`ID: ${usuario1.id}, Nome: ${usuario1.nome}, Status: ativo`);
    expect(relatorio).toContain(`ID: ${usuario2.id}, Nome: ${usuario2.nome}, Status: ativo`);
  });

  test('deve lançar erro ao criar usuário menor de idade', () => {
    // Arrange
    const criarUsuarioMenor = () => {
      userService.createUser('Menor', 'menor@email.com', 17);
    };

    // Act & Assert
    expect(criarUsuarioMenor).toThrow('O usuário deve ser maior de idade.');
  });

  test('deve retornar relatório com mensagem de lista vazia quando não há usuários', () => {
    // Act
    const relatorio = userService.generateUserReport();

    // Assert
    expect(relatorio).toContain('--- Relatório de Usuários ---');
    expect(relatorio).toContain('Nenhum usuário cadastrado.');
  });
});
