import type { SiteLocale } from "./i18n";
import { convertText } from "./opencc";
import type { TraditionalVariant } from "./i18n";

type UiStrings = Record<string, string>;

const HOME_STRINGS_ZH: UiStrings = {
  datePending: "日期待补充",
  readMore: "点击查看全文。",
  startReading: "开始阅读",
  visitProject: "访问项目",
  viewPage: "查看页面",
  wechatQrAlt: "微信公众号二维码",
};

const ABOUT_STRINGS_ZH: UiStrings = {
  leftPanelTitle: "我在做什么",
  rightPanelTitle: "这个站点如何阅读",
  principlesTitle: "三条工作原则",
  principlesSubtitle: "项目与内容保持同步增长。",
  milestonesTitle: "品牌里程碑",
  milestonesSubtitle: "持续公开、持续迭代、持续沉淀。",
  ctaTitle: "欢迎继续关注后续更新",
  ctaText: "站点会持续发布新的项目进展和技术文章。",
};

const PROJECTS_STRINGS_ZH: UiStrings = {
  featuredTitle: "重点项目",
  featuredSubtitle: "对外可访问、可验证、可持续迭代。",
  timelineTitle: "持续迭代节奏",
  timelineSubtitle: "项目和内容共用一个增长循环。",
  visitExternal: "访问外站",
  viewDetails: "查看详情",
};

const HOME_STRINGS_EN: UiStrings = {
  datePending: "Date pending",
  readMore: "Open to read the full post.",
  startReading: "Start reading",
  visitProject: "Visit project",
  viewPage: "Open page",
  wechatQrAlt: "WeChat QR code",
};

const ABOUT_STRINGS_EN: UiStrings = {
  leftPanelTitle: "What I focus on",
  rightPanelTitle: "How to read this site",
  principlesTitle: "Working Principles",
  principlesSubtitle: "Execution and documentation grow together.",
  milestonesTitle: "Milestones",
  milestonesSubtitle: "Open process, iterate fast, document learnings.",
  ctaTitle: "Follow the next updates",
  ctaText: "The site will keep publishing project updates and technical notes.",
};

const PROJECTS_STRINGS_EN: UiStrings = {
  featuredTitle: "Featured Projects",
  featuredSubtitle: "Publicly accessible, measurable, and continuously improved.",
  timelineTitle: "Iteration Loop",
  timelineSubtitle: "Products and content evolve in the same cycle.",
  visitExternal: "Visit external site",
  viewDetails: "View details",
};

function convertStrings(strings: UiStrings, variant: TraditionalVariant): UiStrings {
  const result: UiStrings = {};
  for (const [key, value] of Object.entries(strings)) {
    result[key] = convertText(value, variant);
  }
  return result;
}

export function getHomeStrings(locale: SiteLocale): UiStrings {
  if (locale === "en-US") return HOME_STRINGS_EN;
  if (locale === "zh-TW") return convertStrings(HOME_STRINGS_ZH, "tw");
  if (locale === "zh-HK") return convertStrings(HOME_STRINGS_ZH, "hk");
  return HOME_STRINGS_ZH;
}

export function getAboutStrings(locale: SiteLocale): UiStrings {
  if (locale === "en-US") return ABOUT_STRINGS_EN;
  if (locale === "zh-TW") return convertStrings(ABOUT_STRINGS_ZH, "tw");
  if (locale === "zh-HK") return convertStrings(ABOUT_STRINGS_ZH, "hk");
  return ABOUT_STRINGS_ZH;
}

export function getProjectsStrings(locale: SiteLocale): UiStrings {
  if (locale === "en-US") return PROJECTS_STRINGS_EN;
  if (locale === "zh-TW") return convertStrings(PROJECTS_STRINGS_ZH, "tw");
  if (locale === "zh-HK") return convertStrings(PROJECTS_STRINGS_ZH, "hk");
  return PROJECTS_STRINGS_ZH;
}
