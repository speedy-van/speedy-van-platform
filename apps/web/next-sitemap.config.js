/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://www.speedy-van.co.uk",
  generateRobotsTxt: false, // we have our own robots.txt
  sitemapSize: 5000,
  changefreq: "weekly",
  priority: 0.7,
  exclude: ["/admin/*", "/driver/*", "/auth/*", "/api/*", "/track"],
  additionalPaths: async () => {
    const areaSlugues = [
      "glasgow", "glasgow-west-end", "glasgow-southside", "paisley",
      "edinburgh", "edinburgh-leith", "edinburgh-south", "livingston",
      "dundee", "perth", "kirkcaldy", "dunfermline", "st-andrews",
      "aberdeen", "inverurie",
      "inverness", "fort-william",
      "stirling", "falkirk",
      "hamilton", "east-kilbride", "motherwell",
      "ayr", "kilmarnock",
      "oban", "dumfries", "galashiels",
    ];
    const serviceSlugues = [
      "man-and-van", "house-removal", "office-removal", "student-move",
      "furniture-delivery", "ikea-delivery", "rubbish-removal",
      "piano-moving", "same-day-delivery", "packing-service",
    ];

    return [
      { loc: "/", priority: 1.0, changefreq: "daily" },
      { loc: "/book", priority: 0.9, changefreq: "daily" },
      { loc: "/track", priority: 0.5, changefreq: "weekly" },
      { loc: "/jobs", priority: 0.4, changefreq: "daily" },
      { loc: "/privacy", priority: 0.3, changefreq: "monthly" },
      { loc: "/terms", priority: 0.3, changefreq: "monthly" },
      { loc: "/cookies", priority: 0.2, changefreq: "monthly" },
      ...areaSlugues.map((slug) => ({
        loc: `/areas/${slug}`,
        priority: 0.8,
        changefreq: "weekly",
      })),
      ...serviceSlugues.map((slug) => ({
        loc: `/services/${slug}`,
        priority: 0.8,
        changefreq: "weekly",
      })),
    ];
  },
};
