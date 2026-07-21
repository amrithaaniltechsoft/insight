export async function GET(request: Request) {
  const url = new URL('/services/blood-tests', process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000');
  return Response.redirect(url, 307);
}
