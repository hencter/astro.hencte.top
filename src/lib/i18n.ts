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

export type ConnectPage = "home" | "about" | "projects" | "blog" | "links";

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
    "zh-TW": "/tw/blog",
    "zh-HK": "/hk/blog",
    "en-US": "/en/blog",
  },
  links: {
    "zh-CN": "/links",
    "zh-TW": "/tw/links",
    "zh-HK": "/hk/links",
    "en-US": "/en/links",
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
    // Home is the brand logo only — no redundant nav-list entry.
    return [
      { href: "/en/projects", label: "Projects" },
      { href: "/en/blog", label: "Blog" },
      { href: "/en/links", label: "Friends" },
      { href: "/en/about", label: "About" },
      { href: "#contact", label: "Contact" },
    ];
  }

  const labels =
    locale === "zh-TW"
      ? { projects: "項目", blog: "博客", links: "友鏈", about: "關於", contact: "聯繫" }
      : locale === "zh-HK"
        ? { projects: "項目", blog: "博客", links: "友鏈", about: "關於", contact: "聯絡" }
        : { projects: "项目", blog: "博客", links: "友链", about: "关于", contact: "联系" };

  const blogHref = locale === "zh-TW" ? "/tw/blog" : locale === "zh-HK" ? "/hk/blog" : "/blog";
  const linksHref = locale === "zh-TW" ? "/tw/links" : locale === "zh-HK" ? "/hk/links" : "/links";

  // Home is the brand logo only — no redundant nav-list entry.
  return [
    { href: `${prefix}/projects`, label: labels.projects },
    { href: blogHref, label: labels.blog },
    { href: linksHref, label: labels.links },
    { href: `${prefix}/about`, label: labels.about },
    { href: "#contact", label: labels.contact },
  ];
}

export type LanguageLink = {
  locale: SiteLocale;
  href: string;
  label: string;
  current: boolean;
};

export function getLanguageLinks(
  currentLocale: SiteLocale,
  page: ConnectPage
): LanguageLink[] {
  return getChromeLanguageLinks(currentLocale, { page });
}

/**
 * Site chrome language switcher targets.
 * Prefer explicit alternates → connect-page peers → that locale's home.
 * Always returns one entry per SiteLocale so the header switcher never vanishes.
 */
export function getChromeLanguageLinks(
  currentLocale: SiteLocale,
  options?: {
    page?: ConnectPage;
    alternates?: Record<string, string>;
  }
): LanguageLink[] {
  const pagePaths = options?.page ? PAGE_PATHS[options.page] : null;
  const alts = options?.alternates;

  return (Object.keys(LOCALE_CONFIG) as SiteLocale[]).map((locale) => {
    const fromAlt = alts?.[locale];
    const fromPage = pagePaths?.[locale];
    const href =
      (fromAlt && fromAlt.length > 0 ? fromAlt : undefined) ??
      fromPage ??
      LOCALE_CONFIG[locale].path;

    return {
      locale,
      href,
      label: LOCALE_CONFIG[locale].label,
      current: locale === currentLocale,
    };
  });
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

/** Bookshelf routes share slug across locales; DRM fiction pages stay noindex. */
export function getNovelPathPrefix(locale: SiteLocale): string {
  const base = LOCALE_CONFIG[locale].path.replace(/\/$/, "");
  return base ? `${base}/shelf` : "/shelf";
}

export function getNovelHref(locale: SiteLocale, slug?: string): string {
  const prefix = getNovelPathPrefix(locale);
  return slug ? `${prefix}/${slug}` : `${prefix}/`;
}
