# Proteções e limites

JSON UTF-8 até 16 KiB, mídia/encoding verificados, campos extras rejeitados e limites do domínio no servidor. SQL parametrizado. Token aleatório de recurso de 256 bits, somente digest no banco. Recursos privados ou alheios respondem 404.

Escritas de mesma origem quando Origin presente. Sem cookies ou credenciais administrativas. CORS não substitui autorização. CAS por revisão, limite de 30 revisões e 12 criações/hora UTC no conjunto da demo. TTL de sete dias; não há controle de conta/IP ou mitigação integral de DDoS.

API com no-store, nosniff, no-referrer e erros mascarados com request_id. Sem stack traces/tokens nas respostas. Dados sintéticos; nenhum pagamento, e-mail, IA externa ou informação pessoal exigida. Dependências fixadas no lockfile. A demonstração não é indicada para dados sensíveis.

Póstera oculta a mensagem até a abertura inclusive do proprietário, bloqueia exportação antecipada e edição após o selo. Não há criptografia ponta a ponta nem proteção contra administradores do banco. A exclusão autorizada continua possível.
