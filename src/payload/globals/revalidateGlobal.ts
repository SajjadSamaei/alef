import { revalidateTag } from "next/cache";
import type { GlobalAfterChangeHook } from "payload";

export const revalidateGlobal =
  (slug: string): GlobalAfterChangeHook =>
  ({ doc, req: { context, payload } }) => {
    if (!context.disableRevalidate) {
      payload.logger.info(`Revalidating global: ${slug}`);
      try {
        revalidateTag(`global_${slug}`, "max");
      } catch (error) {
        payload.logger.warn(
          `Skipped Next cache revalidation for global ${slug}: ${
            (error as Error).message
          }`,
        );
      }
    }

    return doc;
  };
