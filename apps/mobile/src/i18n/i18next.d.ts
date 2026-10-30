import "i18next";
import type { resources } from ".";

// Typed keys: t("missing.key") is a compile error.
declare module "i18next" {
  interface CustomTypeOptions {
    resources: (typeof resources)["en"];
  }
}
