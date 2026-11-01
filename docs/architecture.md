# Arquitetura

Modo integrado: Stencil, WebGL e Canvas consome Elysia e TypeBox na mesma origem. SSR entrega conteúdo editorial, imagens, metadados e navegação. ClientBoot monta o bundle após a hidratação do documento para evitar conflito entre runtimes.

`server/service.mjs`: domínio, validação e exportador. `api.mjs`: router próprio da stack. `routes.mjs`: operações. `store.mjs`: D1, revisão, autorização e TTL. `transport.mjs`: corpo limitado e erros padronizados.

Snell e Cauchy em 2D. Rotação ±60°, incidência ±30°, índice 1,3–1,9, dispersão 0–100. Seis comprimentos de onda, até oito interações por raio, com reflexão interna total. Índices artísticos, não especificação de vidro.

Cada registro possui UUID, receita JSON, digest SHA-256 de token de 256 bits, revisão e timestamps UTC. UPDATE condicional por revisão impõe CAS. Contador atômico limita criações por hora UTC. Exclusão só do próprio recurso. Cliente guarda no máximo doze capacidades por aba e nunca as põe no URL.



Testes de integração usam Miniflare e migrações reais em diretório temporário. Smoke cria e remove somente seu próprio registro sintético. Não há reset público ou operação administrativa no cliente.
