export function GET() {
  return new Response("ok", {
    headers: {
      "content-type": "text/plain; charset=utf-8",
    },
    status: 200,
  });
}
