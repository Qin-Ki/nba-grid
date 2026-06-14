// Cloudflare Pages Function - NBA 头像代理
// 访问 /api/headshot?pid=2544 返回带头像的图片（带 CORS 头）
export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const pid = url.searchParams.get('pid');

  if (!pid) {
    return new Response('Missing pid parameter', { status: 400 });
  }

  const imageUrl = `https://cdn.nba.com/headshots/nba/latest/260x190/${pid}.png`;

  try {
    const resp = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Cloudflare Pages'
      }
    });

    if (!resp.ok) {
      return new Response('Image fetch failed: ' + resp.status, { status: resp.status });
    }

    const headers = new Headers(resp.headers);
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Cache-Control', 'public, max-age=86400');

    return new Response(resp.body, {
      status: resp.status,
      headers: headers
    });
  } catch (error) {
    return new Response('Error: ' + error.message, { status: 500 });
  }
}
