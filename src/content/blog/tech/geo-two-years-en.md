---
title: "GEO, Two Years In: What 16 Primary Sources Reveal About the Truth, the Lies, and the Money"
date: 2026-09-02
publishDate: "2026-09-02"
tags: ["GEO", "generative engine optimization", "AI search", "SEO", "fact-checking"]
toc: true
description: "A fact-first look at Generative Engine Optimization (GEO) after verifying 16 primary sources: the KDD 2024 paper, Pew click-through data, Google's official stance, Cloudflare's pay-per-crawl, llms.txt reality, the CCTV 315 poisoning case, and the noise economy of 110+ Chinese vendors."
draft: false
section: "tech"
keywords: ["GEO", "generative engine optimization", "AI search", "SEO", "llms.txt", "Pew", "CCTV 315"]
---

September 2, 2026. This post is about GEO — Generative Engine Optimization, the practice of making your content get cited by AI answer engines like ChatGPT. In the past two years it has been marketed as "the SEO killer" and "free ad space in the AI era," spawning hundreds of vendors and tens of billions in funding. After checking 16 primary sources, here is my conclusion: the real problem is real, and the myth is thicker.

## A smart band that does not exist

On March 15, 2026, China's CCTV 315 consumer-rights gala aired an experiment<sup id="fnref:1"><a href="#fn:1" rel="footnote">[1]</a></sup>.

Investigators bought a GEO tool called "Liqing GEO Optimization System" from an e-commerce platform. They used it to auto-generate promotional articles for a smart band, deliberately stuffing in fabricated specs — including an absurd "quantum entanglement sensing" feature and "black-hole-class battery life." Two hours after publishing, asking "how is the Apollo-9 smart band?" made a major AI model answer confidently, parroting the fabricated specs.

They then generated 8 "expert reviews," 2 "industry rankings," and 1 "user review" — 11 articles total — published over three days. Asked "recommend a smart health band," two major AI models recommended this nonexistent product near the top.

The operator, surnamed Li of Beijing Lisi Culture Media, said it plainly on air: GEO's popularity comes from "feeding and poisoning" the AI models to achieve clients' commercial goals.

That experiment proves both sides of GEO at once: it can get your content cited by AI; it can also get lies cited by AI. Here is the evidence, layered by quality.

## Where GEO comes from: the real boundary of 40%

The term GEO comes from a KDD 2024 paper by researchers at IIT Delhi and Princeton<sup id="fnref:2"><a href="#fn:2" rel="footnote">[2]</a></sup>. The paper did three things: defined a framework for "generative engines," built a benchmark of 10,000 queries (GEO-bench), and tested nine optimization methods. The headline: citing sources, quoting verbatim, and adding statistics can raise your content's "citation visibility" by up to 40%<sup id="fnref:2b"><a href="#fn:2" rel="footnote">[2]</a></sup>.

The boundary matters. The paper measures "visibility" — a position-adjusted citation metric (how often and how prominently your content is cited in AI answers). **It is not clicks, and not revenue.**

A telling footnote from the same era: Wikipedia's article on GEO carries a neologism banner, and as of early 2026 there is still no consensus definition in the literature<sup id="fnref:3"><a href="#fn:3" rel="footnote">[3]</a></sup>. AEO, AIO, LLMO — the near-synonyms pile up. This is a field where the marketing word runs ahead of the academic word and the industry word.

## How engines decide what to cite

Google's own documentation spells out the mechanism for AI Overviews and AI Mode<sup id="fnref:4"><a href="#fn:4" rel="footnote">[4]</a></sup>: both are built on retrieval-augmented generation (RAG), retrieving pages from the same index with the core ranking systems, then handing them to a large model to compose the answer — including query fan-out, where one question is split into multiple sub-queries.

Two implications. First: if you are not in the index, you do not exist in AI answers — "special optimization" sits on top of the boring foundation of being crawlable and indexable. Second: you used to optimize for one keyword; now you optimize for a tree of questions.

The bigger move comes from Cloudflare. On July 1, 2025, CEO Matthew Prince declared "Content Independence Day": **block AI crawlers by default unless they pay**<sup id="fnref:5"><a href="#fn:5" rel="footnote">[5]</a></sup>. The same day it launched a pay-per-crawl private beta — crawlers either pay (HTTP 402) for content or get refused (Allow/Charge/Block). Cloudflare itself spelled out the meaning: the 30-year-old internet contract of "we crawl you, you get referral traffic" is dead<sup id="fnref:5b"><a href="#fn:5" rel="footnote">[5]</a></sup>.

## The traffic truth: the numbers

Pew Research published two crucial comparisons in July 2025<sup id="fnref:6"><a href="#fn:6" rel="footnote">[6]</a></sup>:

| Metric | With AI summary | Without AI summary |
|--------|-----------------|--------------------|
| Users clicking traditional results | 8% of visits | 15% of visits |
| Ending browsing session immediately | 26% of pages | 16% of pages |
| Clicking links inside the AI summary | only 1% of visits | — |

AI summaries are compressing clicks hard. Encyclopedia-type sources are cited in 26% of summaries — but almost nobody clicks through.

Ahrefs' research zooms in on the ranking side<sup id="fnref:7"><a href="#fn:7" rel="footnote">[7]</a></sup>. Across a 300,000-keyword sample, when an AI Overview appears, the #1 result's click-through rate is 34.5% lower than on keywords without one (April 2025). A February 2026 rerun found the gap had worsened to 58%.

Here is the honest caveat: **a lower CTR is not the same as lower total traffic.** Google's official line is that AI Overviews increase user satisfaction. No public study closes the causal loop — whether the 58% who did not click the #1 result went to other links in the AI answer, or to nothing at all. That remains unknown<sup id="fnref:8"><a href="#fn:8" rel="footnote">[8]</a></sup>.

One more sobering number: Similarweb's research puts AI chatbot referral traffic at roughly 1% of all site visits, with ChatGPT at 92.4% of that<sup id="fnref:9"><a href="#fn:9" rel="footnote">[9]</a></sup> (first-party page unreachable during verification; marked pending).

## Platforms talk plainly, vendors sell myth

Two direct quotes from Google's documentation<sup id="fnref:4b"><a href="#fn:4" rel="footnote">[4]</a></sup>:

> "There are no additional requirements nor special optimizations necessary" to appear in AI Overviews or AI Mode.
> "From Google's perspective, optimizing for generative AI search is optimizing for search, so it's still SEO."

Google's Danny Sullivan put it more bluntly: "Good SEO is good GEO."<sup id="fnref:10"><a href="#fn:10" rel="footnote">[10]</a></sup> John Mueller said much the same in July 2025: "all you need to do is normal SEO."

Now the vendor side. Profound (total funding $58.5M) claims in its PR "a 700% increase in AI referrals in some cases"<sup id="fnref:11"><a href="#fn:11" rel="footnote">[11]</a></sup>. A Chinese vendor markets "99.7% semantic-match accuracy" and "$1.1M in first-month sales"<sup id="fnref:12"><a href="#fn:12" rel="footnote">[12]</a></sup> — none verifiable.

The most damning item: a widely circulated Chinese implementation guide cites a supposed "OpenAI《GEO Optimization Team Collaboration Guide》" claiming a 70% efficiency gain — **I searched every engine I could; OpenAI never published such a document. It is a fabricated citation**<sup id="fnref:13"><a href="#fn:13" rel="footnote">[13]</a></sup>.

The structural conflict of interest is clear: platforms live off a healthy content ecosystem, so they tell you not to panic; vendors live off your anxiety, so they tell you to hurry. Listen to both — and know who is making money off you.

## What actually works: three tiers of evidence

### High confidence (research or official documentation)

- SEO fundamentals: crawlability, indexability, speed — the prerequisite for every AI citation<sup id="fnref:4c"><a href="#fn:4" rel="footnote">[4]</a></sup>
- First-hand, unique, factual content — Google explicitly says first-hand reviews beat regurgitation<sup id="fnref:4d"><a href="#fn:4" rel="footnote">[4]</a></sup>
- Citing sources, quoting verbatim, adding statistics — the paper's experiments show >40% visibility gains<sup id="fnref:2"><a href="#fn:2" rel="footnote">[2]</a></sup>
- Consistent brand-entity representation across channels
- Genuine presence in third-party corpora (Reddit, Zhihu, review sites) — CXL cites Semrush findings that ChatGPT frequently cites pages ranked 21+ in Google<sup id="fnref:14"><a href="#fn:14" rel="footnote">[14]</a></sup>

### Medium confidence (logical but thinly evidenced)

- llms.txt: a proposed standard by Jeremy Howard (Sept 2024). Real-world reports from sites hosting 20,000 domains show no AI crawlers fetching it. Google's Mueller, verbatim: "**AFAIK none of the AI services have said they're using LLMs.TXT (and you can tell when you look at your server logs that they don't even check for it)**"<sup id="fnref:15"><a href="#fn:15" rel="footnote">[15]</a></sup>
- GEO monitoring tools: "were you mentioned" is measurable; "mention → revenue" is not attributable by anyone

### Low confidence / high risk

- Hidden text, prompt injection, manufactured consensus — violates platform policies; the 315 case demonstrated the legal and regulatory risk<sup id="fnref:1"><a href="#fn:1" rel="footnote">[1]</a></sup>
- "Guaranteed AI placement" services — AI answers come from a black box with a moving model; "guaranteed" is technically meaningless

## The noise economy: where the money flows

Globally, Sequoia-backed Profound has raised $58.5M in total<sup id="fnref:11"><a href="#fn:11" rel="footnote">[11]</a></sup>. In China, WanGong Research Institute tracked 110+ GEO vendors; only ~19 had raised funding — 21 deals, ¥5.5B total, penetration under 15%<sup id="fnref:16"><a href="#fn:16" rel="footnote">[16]</a></sup>. It also made the uncomfortable point itself: many companies fundraise on the GEO story while capital is actually betting on their pre-existing marketing business — "GEO looks more like a new story told to the market."

The marketing-number pipeline keeps running: unattributed agencies produce "71% of enterprises have entered the field" and "2.8x conversion lift," which get republished, enter internal briefings, and become decision inputs — with no verifiable original source anywhere. I even re-audited my own vault's old swarm reports: "AI traffic +693%" and "4.4x conversion" traced back to vendor blogs, not primary sources<sup id="fnref:17"><a href="#fn:17" rel="footnote">[17]</a></sup>.

## Finally, what you can do

Three things you can do today: confirm your site is properly indexable<sup id="fnref:4"><a href="#fn:4" rel="footnote">[4]</a></sup>; rewrite your key product-fact pages as question-answer pairs with first-party data; and build a 20-question checklist you run weekly against the mainstream AI engines, recording whether you got mentioned — be your own monitoring tool.

What not to buy: guaranteed AI placement, undated "XX% lift" case collections, llms.txt one-click magic pills, and vendors who cite fabricated sources.

At bottom, GEO's core methodology — making AI know you accurately — is mostly good SEO plus a little new awareness. The real dividing line is not technical: are you a content creator who wants to be cited accurately, or someone poisoning the AI? After 315, that choice is not just moral. It is legal.

*中文版：[GEO 两年：我翻了 16 个一手信源，把这门生意的真话和谎话分开](/tech/geo-two-years)*

Recommended reading:
- [SEO+GEO Three-Tier Architecture: Search Optimization in the LLM Era](/tech/seo-geo-architecture) — structured data, dual-path content processing, unified observability
- [AI Anti-Hallucination Workflow: A Systematic Approach to Information Verification](/tech/anti-hallucination-workflow) — four-tier source priority, cross-validation rules, real-time verification

---

<ol>
  <li id="fn:1" style="font-size:0.875rem">
    CCTV 315 Gala, "AI large models poisoned? Feeding and poisoning AI has become an industry chain," 2026-03-15. Via Tencent News / Lieyunwang: <a href="https://news.qq.com/rain/a/20260315A073XU00">news.qq.com/rain/a/20260315A073XU00</a> <a href="#fnref:1" rev="footnote">↩</a>
  </li>
  <li id="fn:2" style="font-size:0.875rem">
    Aggarwal et al. <em>GEO: Generative Engine Optimization</em>. KDD 2024, doi:10.1145/3637528.3671900. arXiv:<a href="https://arxiv.org/abs/2311.09735">2311.09735</a>; full HTML: <a href="https://arxiv.org/html/2311.09735v3">arxiv.org/html/2311.09735v3</a> <a href="#fnref:2" rev="footnote">↩</a>
  </li>
  <li id="fn:3" style="font-size:0.875rem">
    Wikipedia, <em>Generative engine optimization</em>, neologism banner as of Aug 2026; "no consensus definition in the academic literature as of early 2026." <a href="https://en.wikipedia.org/wiki/Generative_engine_optimization">en.wikipedia.org/wiki/Generative_engine_optimization</a> <a href="#fnref:3" rev="footnote">↩</a>
  </li>
  <li id="fn:4" style="font-size:0.875rem">
    Google Search Central, <em>Optimizing for generative AI</em> + <em>AI features</em>: "There are no additional requirements nor special optimizations necessary." Still live in 2026. <a href="https://developers.google.com/search/docs/fundamentals/ai-optimization-guide">developers.google.com/search/docs/fundamentals/ai-optimization-guide</a> <a href="#fnref:4" rev="footnote">↩</a>
  </li>
  <li id="fn:5" style="font-size:0.875rem">
    Cloudflare Blog: <em>Content Independence Day: no AI crawl without compensation</em> (2025-07-01), <em>Introducing pay per crawl</em> (2025-07-01), <em>Your site, your rules</em> (2026-07-01). <a href="https://blog.cloudflare.com/content-independence-day-no-ai-crawl-without-compensation/">blog.cloudflare.com/content-independence-day-no-ai-crawl-without-compensation/</a> <a href="#fnref:5" rev="footnote">↩</a>
  </li>
  <li id="fn:6" style="font-size:0.875rem">
    Pew Research Center, <em>Google users are less likely to click on links when an AI summary appears</em>, 2025-07-22. <a href="https://www.pewresearch.org/short-reads/2025/07/22/google-users-are-less-likely-to-click-on-links-when-an-ai-summary-appears-in-the-results/">pewresearch.org/short-reads/2025/07/22</a> <a href="#fnref:6" rev="footnote">↩</a>
  </li>
  <li id="fn:7" style="font-size:0.875rem">
    Ryan Law &amp; Xibeijia Guan, Ahrefs: <em>AI Overviews Reduce Clicks by 34.5%</em> (2025-04-17); <em>Update: AI Overviews Reduce Clicks by 58%</em> (2026-02-04). 300K keywords, GSC CTR. <a href="https://ahrefs.com/blog/ai-overviews-reduce-clicks/">ahrefs.com/blog/ai-overviews-reduce-clicks/</a> <a href="#fnref:7" rev="footnote">↩</a>
  </li>
  <li id="fn:8" style="font-size:0.875rem">
    The honest causal gap: Ahrefs measures "lower CTR for #1 when AI Overviews present"; Google claims AI Overviews raise satisfaction. Where the clicks went (other results / AI-internal links / zero-click) — no public end-to-end attribution. This is an inference. <a href="#fnref:8" rev="footnote">↩</a>
  </li>
  <li id="fn:9" style="font-size:0.875rem">
    Similarweb / via authoritytech.io: "AI referrals ≈1% of site visits, ChatGPT = 92.4% of that." First-party page (similarweb.com) failed direct fetch (SSL); downgraded to pending verification. <a href="#fnref:9" rev="footnote">↩</a>
  </li>
  <li id="fn:10" style="font-size:0.875rem">
    Danny Goodwin, Search Engine Land: <em>Google's Danny Sullivan: "Good SEO is good GEO"</em>, 2025-09-02, from his WordCamp US keynote 2025-08-28. <a href="https://searchengineland.com/google-danny-sullivan-good-seo-good-geo-461464">searchengineland.com/461464</a> <a href="#fnref:10" rev="footnote">↩</a>
  </li>
  <li id="fn:11" style="font-size:0.875rem">
    Profound PR Newswire, 2025-08-12: $35M Series B led by Sequoia, total $58.5M. "700 percent increase in AI referrals in some cases" is vendor marketing language. <a href="https://www.prnewswire.com/news-releases/profound-raises-35m-series-b-as-ai-search-becomes-the-next-platform-shift-302527764.html">prnewswire.com/302527764</a> <a href="#fnref:11" rev="footnote">↩</a>
  </li>
  <li id="fn:12" style="font-size:0.875rem">
    Zhitui Shidai funding release, Sohu 2025-10-29 (37 Interactive Entertainment lead, Qushui Technology follow). Its implementation guide claims "99.7% semantic match," "search volume +220%," "¥8M first-month sales" — no verification method. <a href="https://www.sohu.com/a/949150771_121419396">sohu.com/a/949150771_121419396</a> <a href="#fnref:12" rev="footnote">↩</a>
  </li>
  <li id="fn:13" style="font-size:0.875rem">
    The "OpenAI《GEO Optimization Team Collaboration Guide》(2026-02)" appears in a Chinese implementation guide circulating in the author's vault. Exact-phrase search across DDG/Bing/Google: zero hits. Judged a fabricated citation. <a href="#fnref:13" rev="footnote">↩</a>
  </li>
  <li id="fn:14" style="font-size:0.875rem">
    Tarek Reslan, CXL: <em>Is AEO/GEO Just SEO Hype? What the Data Actually Shows</em>, 2026-01-27. <a href="https://cxl.com/blog/aeo-geeo-seo-reality-check/">cxl.com/blog/aeo-geeo-seo-reality-check/</a> That article cites the Semrush finding. <a href="#fnref:14" rev="footnote">↩</a>
  </li>
  <li id="fn:15" style="font-size:0.875rem">
    Roger Montti, Search Engine Journal: <em>Google Says LLMs.Txt Comparable To Keywords Meta Tag</em>, 2025-04-17. Quotes Mueller: "AFAIK none of the AI services have said they're using LLMs.TXT (and you can tell when you look at your server logs that they don't even check for it)." <a href="https://www.searchenginejournal.com/google-says-llms-txt-comparable-to-keywords-meta-tag/544804/">searchenginejournal.com/544804</a> <a href="#fnref:15" rev="footnote">↩</a>
  </li>
  <li id="fn:16" style="font-size:0.875rem">
    WanGong Research Institute, via Tencent News 2026-07-17: 110+ GEO vendors tracked, only ~19 funded across 21 deals totaling ¥5.5B, penetration &lt;15%. The institute runs its own graph/ranking/whitepaper business; conflict of interest noted. <a href="https://news.qq.com/rain/a/20260717A055M100">news.qq.com/rain/a/20260717A055M100</a> <a href="#fnref:16" rev="footnote">↩</a>
  </li>
  <li id="fn:17" style="font-size:0.875rem">
    The vault's own 2026-05-29 swarm reports (swarm_reports/2026-05-29_geo-ad/) had cited "35% extra clicks / 4.4x conversion / 693% growth / 50.5% CAGR" — re-audit traced these to vendor blogs (Searchable, AirOps, Moz); failed primary-source bar; downgraded to pending. This post does not use those numbers. <a href="#fnref:17" rev="footnote">↩</a>
  </li>
</ol>