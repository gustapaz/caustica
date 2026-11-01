# CÁUSTICA · contrato integrado

portfolio-orchestrator + frontend-portfolio + backend-portfolio. Uma solução, um repositório, uma origem HTTPS. Stencil + WebGL / Elysia + TypeBox, D1 persistente e Vinext somente como transporte/HTML. Frontend próprio compilado em public/experience. Sem cartão, trial, cobrança ou serviços externos reais.

Produto: Luz, vidro e cor em um laboratório óptico interativo. O domínio e os dados específicos estão em server/service.mjs; o schema desse módulo é canônico. Fixtures são sintéticas; cálculos, autorização, banco, revisões e exportações são reais. Nenhum fallback silencioso para dados locais quando a API falhar.

GET /api/catalog fornece parâmetros iniciais e conteúdo curatorial. POST /api/compute calcula sem persistir (Ímã usa também oRPC em /api/rpc/match pelo cliente tipado). POST /api/records {title,input} cria estudo privado com token de recurso de 256 bits; só digest no banco. GET|PUT|DELETE /api/records/:id; edição exige expected_revision e token; 409 na disputa. POST /api/records/:id/publish exige revisão e boolean published. GET /api/records/:id/export usa a mesma autorização da leitura. GET /api/health e /api/openapi.json. Leitura pública apenas após autorização explícita; link /?record=:id sem token. Exportação sempre da revisão salva.

Título 1–48 caracteres, JSON 16 KiB, 12 criações/hora UTC globais, máximo 30 revisões e TTL de 7 dias. Datas Unix seconds UTC. Falhas {code,message,request_id}: 400 JSON, 403 origem, 404 recurso/permissão, 409 conflito, 413 bytes, 415 mídia, 422 validação, 423 cápsula ainda fechada, 429 cota, 500 mascarado. sessionStorage da aba guarda até 12 acessos próprios; fechar a aba pode perder edição. Sem cookies, CORS aberto, conta ou senhas reais.

Póstera: ao selar, conteúdo e título tornam-se imutáveis; a expiração passa a 7 dias do selo. O servidor fixa opens_at = agora + delay_seconds (60 s–6 dias), redige message como null para todos enquanto bloqueado e recusa exportação 423. Não há retirada de selo; proprietário pode excluir sua própria cápsula. Não é cofre criptografado: mensagens sintéticas, acesso por aplicação, sem alegação de criptografia ponta a ponta.

Concluir: fluxo pelo frontend real contra backend real, cálculos do domínio, falhas/limites, salvar/reler/editar/compartilhar/exportar, autorização entre recursos, concorrência, expiração e persistência após reabrir runtime. Conferir desktop, contexto estreito, teclado e movimento reduzido. CI deve reproduzir instalação, testes, tipos e build. Publicar e conferir CI, health, operação real e apenas gustapaz como contribuidor.

Comandos: npm ci; npm test; npm run typecheck; npm run check; npm run build; npm run db:migrate; npm start -- --port 5250. Migrações geradas pelo Drizzle, inspecionadas e imutáveis depois de aplicar. Banco de teste Miniflare isolado, sem reset público. Disponibilidade sujeita à hospedagem gratuita; não há SLA.
