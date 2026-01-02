// @ts-nocheck
import config from "@payload-config";
import { GRAPHQL_POST, REST_OPTIONS } from "@payloadcms/next/routes";

type NextCtx = { params: Promise<{ slug?: string[] }> };
type PayloadCtx = { params: Promise<{ slug: string[] }> };

const coerceCtx = (ctx: NextCtx): PayloadCtx => ({
  params: ctx.params.then((p) => ({ slug: p?.slug ?? [] })),
});

export function POST(req: Request) {
  return GRAPHQL_POST(config)(req);
}

export function OPTIONS(req: Request, ctx: NextCtx) {
  return REST_OPTIONS(config)(req, coerceCtx(ctx));
}
