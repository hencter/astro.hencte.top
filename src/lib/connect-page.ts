import { getEntry } from "astro:content";
import { getMirroredConnect } from "./connect-mirror";
import { localeToVariant, type ConnectPage, type SiteLocale } from "./i18n";

/**
 * Single loader for connect-page data across locales:
 * zh-CN → zh/<page>, en-US → en/<page>, zh-TW/zh-HK → OpenCC mirror of zh.
 * Route shells should never branch on this themselves.
 */
export async function getConnectPageData(page: ConnectPage, locale: SiteLocale) {
  const variant = localeToVariant(locale);
  if (variant) {
    return getMirroredConnect(page, variant);
  }
  const key = locale === "en-US" ? "en" : "zh";
  const entry = await getEntry("connect", `${key}/${page}`);
  if (!entry) {
    throw new Error(`Missing connect content: ${key}/${page}`);
  }
  return entry.data;
}
