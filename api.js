// Einfacher API-Server in einer einzigen Datei (Netlify Function)
// Erreichbar unter: https://DEINE-SEITE.netlify.app/api/...

const json = (statusCode, data) => ({
  statusCode,
  headers: {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  },
  body: JSON.stringify(data),
});

exports.handler = async (event) => {
  // CORS-Preflight
  if (event.httpMethod === "OPTIONS") return json(204, {});

  // Pfad nach "/api" ermitteln
  const path = event.path
    .replace(/^\/\.netlify\/functions\/api/, "")
    .replace(/^\/api/, "") || "/";
  const method = event.httpMethod;

  // GET /api
  if (method === "GET" && path === "/") {
    return json(200, {
      name: "Meine API",
      status: "online",
      endpoints: ["GET /api/hello?name=Welt", "GET /api/time", "POST /api/echo"],
    });
  }

  // GET /api/hello?name=Max
  if (method === "GET" && path === "/hello") {
    const name = event.queryStringParameters?.name || "Welt";
    return json(200, { message: `Hallo, ${name}!` });
  }

  // GET /api/time
  if (method === "GET" && path === "/time") {
    return json(200, { time: new Date().toISOString() });
  }

  // POST /api/echo  (gibt den gesendeten JSON-Body zurück)
  if (method === "POST" && path === "/echo") {
    try {
      const body = event.body ? JSON.parse(event.body) : {};
      return json(200, { received: body });
    } catch {
      return json(400, { error: "Ungültiges JSON" });
    }
  }

  return json(404, { error: "Nicht gefunden", path, method });
};
