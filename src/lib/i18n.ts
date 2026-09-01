export type SiteLocale = "zh-CN" | "zh-TW" | "zh-HK" | "en-US";
export type TraditionalVariant = "tw" | "hk";

export const LOCALE_CONFIG: Record<
  SiteLocale,
  { path: string; htmlLang: string; ogLocale: string; label: string }
> = {
  "zh-CN": { path: "/", htmlLang: "zh-CN", ogLocale: "zh_CN", label: "简体" },
  "zh-TW": { path: "/tw", htmlLang: "zh-TW", ogLocale: "zh_TW", label: "繁體（台灣）" },
  "zh-HK": { path: "/hk", htmlLang: "zh-HK", ogLocale: "zh_HK", label: "繁體（香港）" },
  "en-US": { path: "/en", htmlLang: "en", ogLocale: "en_US", label: "EN" },
};

export type ConnectPage = "home" | "about" | "projects" | "blog";

const PAGE_PATHS: Record<ConnectPage, Record<SiteLocale, string>> = {
  home: {
    "zh-CN": "/",
    "zh-TW": "/tw",
    "zh-HK": "/hk",
    "en-US": "/en",
  },
  about: {
    "zh-CN": "/about",
    "zh-TW": "/tw/about",
    "zh-HK": "/hk/about",
    "en-US": "/en/about",
  },
  projects: {
    "zh-CN": "/projects",
    "zh-TW": "/tw/projects",
    "zh-HK": "/hk/projects",
    "en-US": "/en/projects",
  },
  blog: {
    "zh-CN": "/blog",
    "zh-TW": "/blog",
    "zh-HK": "/blog",
    "en-US": "/en/blog",
  },
};

export function getPageAlternates(page: ConnectPage): Record<string, string> {
  const paths = PAGE_PATHS[page];
  return {
    "zh-CN": paths["zh-CN"],
    "zh-TW": paths["zh-TW"],
    "zh-HK": paths["zh-HK"],
    "en-US": paths["en-US"],
    "x-default": paths["zh-CN"],
  };
}

export function localeToVariant(locale: SiteLocale): TraditionalVariant | null {
  if (locale === "zh-TW") return "tw";
  if (locale === "zh-HK") return "hk";
  return null;
}

export function isEnglish(locale: SiteLocale): boolean {
  return locale === "en-US";
}

export function isChinese(locale: SiteLocale): boolean {
  return locale.startsWith("zh-");
}

export function getNavLinks(locale: SiteLocale) {
  const base = LOCALE_CONFIG[locale].path.replace(/\/$/, "");
  const prefix = base === "" ? "" : base;

  if (locale === "en-US") {
    return [
      { href: "/en", label: "Home" },
      { href: "/en/projects", label: "Projects" },
      { href: "/en/blog", label: "Blog" },
      { href: "/en/about", label: "About" },
      { href: "#contact", label: "Contact" },
    ];
  }

  const labels =
    locale === "zh-TW"
      ? { home: "首頁", projects: "項目", blog: "博客", about: "關於", contact: "聯繫" }
      : locale === "zh-HK"
        ? { home: "首頁", projects: "項目", blog: "博客", about: "關於", contact: "聯絡" }
        : { home: "首页", projects: "项目", blog: "博客", about: "关于", contact: "联系" };

  return [
    { href: prefix || "/", label: labels.home },
    { href: `${prefix}/projects`, label: labels.projects },
    { href: "/blog", label: labels.blog },
    { href: `${prefix}/about`, label: labels.about },
    { href: "#contact", label: labels.contact },
  ];
}

export function getLanguageLinks(
  currentLocale: SiteLocale,
  page: ConnectPage
): { locale: SiteLocale; href: string; label: string; current: boolean }[] {
  const alternates = getPageAlternates(page);
  return (Object.keys(LOCALE_CONFIG) as SiteLocale[]).map((locale) => ({
    locale,
    href: alternates[locale] ?? LOCALE_CONFIG[locale].path,
    label: LOCALE_CONFIG[locale].label,
    current: locale === currentLocale,
  }));
}

export function getBrandTagline(locale: SiteLocale): string {
  if (locale === "en-US") return "Build a memorable technical brand";
  if (locale === "zh-TW") return "讓技術能力成為長期影響力";
  if (locale === "zh-HK") return "讓技術能力成為長期影響力";
  return "让技术能力成为长期影响力";
}

export function getDateLocale(locale: SiteLocale): string {
  if (locale === "en-US") return "en-US";
  if (locale === "zh-TW") return "zh-TW";
  if (locale === "zh-HK") return "zh-HK";
  return "zh-CN";
}
