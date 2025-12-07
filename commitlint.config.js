// Configuração de commits seguindo o Conventional Commits (https://www.conventionalcommits.org/en/v1.0.0/)
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Define os tipos de commit permitidos e que sejam obrigatórios
    'type-enum': [
      2,
      'always',
      [
        'feat', // Nova funcionalidade
        'fix', // Correção de bug
        'docs', // Documentação
        'style', // Formatação, ponto e virgula (não afeta código)
        'refactor', // Refatoração (sem fix ou feat)
        'test', // Adição de testes
        'chore', // Atualização de build, dependências, etc
        'revert', // Reverter commit
      ],
    ],

    // Definine que o escopo não pode estar vazio
    'scope-empty': [2, 'never'],

    // Define os escopos permitidos para os commits
    'scope-enum': [2, 'always', ['backend', 'frontend', 'root']],
  },
};
