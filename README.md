# CÁUSTICA

Um laboratório óptico: um feixe encontra um prisma e se divide em seis trajetos.

[Demo gratuita](https://caustica-gustapaz.starrylinen.chatgpt.site) · [API](https://caustica-gustapaz.starrylinen.chatgpt.site/api-docs.html) · [Contrato integrado](docs/solution-contract.md)

## A experiência

Espectro em fundo escuro, tipografia leve sobreposta, corte diagonal de matéria real e bancada técnica. O shader representa vidro; os raios são os segmentos calculados pela API.

Snell e Cauchy em 2D. Rotação ±60°, incidência ±30°, índice 1,3–1,9, dispersão 0–100. Seis comprimentos de onda, até oito interações por raio, com reflexão interna total. Índices artísticos, não especificação de vidro.

Fluxo completo: alterar condições → calcular na API real → guardar no D1 → reler → compartilhar por link de leitura → exportar a revisão salva. Sem mocks substituindo o servidor. Conteúdo sintético, fotografias reais licenciadas.

## Stack

- Interface: Stencil, WebGL e Canvas, bundle independente em `/experience/`.
- Domínio/API: Elysia e TypeBox.
- SSR e runtime: Vinext/Cloudflare Worker. React apenas no documento e bootstrap; a experiência usa sua própria stack após a hidratação.
- Persistência real D1, SQL parametrizado e migrações Drizzle versionadas.

[Arquitetura](docs/architecture.md) · [Design](docs/design.md) · [Segurança](docs/security.md) · [Validação](docs/validation.md)

## Executar

Node.js 24+.

```sh
npm ci
npm test
npm run typecheck
npm run check
npm run build
npm run db:migrate
npm start -- --port 59100
# Em outro terminal:
npm run smoke -- http://127.0.0.1:59100
```

Banco local em `.wrangler/state`, ignorado pelo Git. Gere novas migrações com `npm run db:generate`; não altere as já aplicadas. Hospedagem integrada declarada em `.openai/hosting.json`. Credenciais de publicação entram apenas pelo stdin do helper, nunca no código.

## Limites da demo

Sem cartão, faturamento ou trial. Runtime e D1 oferecidos pela integração Sites desta conta, sem promessa de disponibilidade ilimitada ou permanente. Retenção de 7 dias com limpeza oportunista, 12 criações por hora UTC no conjunto da demo, até 30 revisões por registro e 16 KiB por JSON. Erros explícitos, sem resultado offline inventado.

Edição autorizada por token aleatório de recurso, mantido somente na sessão desta aba. O link contém apenas o UUID e concede leitura. Exporte antes de fechar a aba; não há recuperação do token, conta ou e-mail externo.

O proprietário pode encerrar o link público. Nenhum link público concede edição.

## Licenças

Código original [MIT](LICENSE). Fotografias, fontes e dependências preservadas em [créditos de imagens](docs/assets-license.md), [inventário de imagens](docs/assets.json) e [licenças de dependências](docs/dependency-licenses.md). Textos distribuídos em `docs/third-party/`.



