export default function sitemap() {
  const baseUrl = "https://exoticaagonda.com";
  
  const routes = [
    "",
    "/about",
    "/rooms",
    "/contact",
    "/gallery",
    "/attractions"
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
    changeFrequency: 'monthly',
    priority: route === "" ? 1 : 0.8,
  }));

  return routes;
}
