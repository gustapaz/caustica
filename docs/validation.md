# Validação executada em 01/11/2026

- 20 testes automatizados passaram, usando domínio real e D1/Miniflare com migrações. Cobertura de isolamento, CAS concorrente, TTL, cota, revisão, exportação e persistência ao reabrir runtime.
- Build de produção, TypeScript e Prettier passaram. CI do commit de aplicação publicado aprovado no GitHub.
- Navegador desktop; harness local em viewports internas de 375 px e 753 px, sem rolagem horizontal após correções. O harness foi removido antes da publicação.
- Smoke da URL pública: health/DB/domínio, validação, criar/editar/reler, revisão antiga, privacidade, compartilhar/exportar, HTML e OpenAPI.
- Interface pública: cálculo, guardar, reler, compartilhar, leitura em nova aba sem token de edição e download real. Conteúdo do arquivo baixado validado separadamente.
- O link público não exibiu controle de edição do registro de origem.
- Teclado e controles nativos verificados no fluxo da experiência.

Sem alegação de Lighthouse ou auditoria automática completa de acessibilidade. Fotos WebP locais, fontes locais, DPR limitado e suspensão de trabalho dos canvases fora da tela. Limites do modelo e da demo documentados no README. Todas as abas de teste foram fechadas após o uso.

O SHA de aplicação implantado, os resultados e o hash da exportação estão em [verification.json](verification.json). Este registro e as imagens de prova são documentação posterior ao deploy; não alteram o bundle publicado.
