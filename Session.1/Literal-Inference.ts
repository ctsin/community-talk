declare function handleRequest(url: string, method: "GET" | "POST"): void;

// Change 1:
const req = { url: "https://example.com", method: "GET" };
// Change 2
handleRequest(req.url, req.method as "GET");
