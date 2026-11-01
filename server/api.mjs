import { Elysia } from "elysia";
import { service } from "./service.mjs";
import { routeTable } from "./routes.mjs";
import { guarded, errorResponse } from "./transport.mjs";
export function createApi(db, clock) {
  const app = new Elysia({ aot: false })
    .onParse(() => ({}))
    .onError(({ error, code }) =>
      code === "NOT_FOUND"
        ? Response.json(
            { code: "not_found", message: "Endpoint não encontrado." },
            { status: 404 },
          )
        : errorResponse(error, crypto.randomUUID()),
    );
  for (const [method, path, handler] of routeTable(db, service, clock))
    app.route(method, path, (ctx) => handler(ctx.request, ctx.params));
  return guarded((req) => app.fetch(req));
}
