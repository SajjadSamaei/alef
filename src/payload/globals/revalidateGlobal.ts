import { revalidateTag } from "next/cache";
import type { GlobalAfterChangeHook } from "payload";

export const revalidateGlobal =
  (slug: string): GlobalAfterChangeHook =>
  ({ doc, req: { context, payload } }) => {
    if (!context.disableRevalidate) {
      payload.logger.info(`Revalidating global: ${slug}`);
      revalidateTag(`global_${slug}`, "max");
    }

    return doc;
  };
