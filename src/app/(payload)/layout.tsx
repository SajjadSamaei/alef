/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import config from "@payload-config";
import "@payloadcms/next/css";
import type { ServerFunctionClient } from "payload";
import { handleServerFunctions, RootLayout } from "@payloadcms/next/layouts";
import React, { Suspense } from "react"; // 1. Import Suspense

import { importMap } from "./payload/importMap.js";
import "./custom.scss";

type Args = {
  children: React.ReactNode;
};

function PayloadLoading() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-zinc-950 text-white">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent" />
    </div>
  );
}

const serverFunction: ServerFunctionClient = async function (args) {
  "use server";
  return handleServerFunctions({
    ...args,
    config,
    importMap,
  });
};

const Layout = ({ children }: Args) => (
  <Suspense fallback={<PayloadLoading />}>
    <RootLayout
      config={config}
      importMap={importMap}
      serverFunction={serverFunction}
    >
      {children}
    </RootLayout>
  </Suspense>
);

export default Layout;
