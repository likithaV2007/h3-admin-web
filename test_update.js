const fetch = require('node-fetch');
async function test() {
  const res = await fetch('https://h3apps-api.hope3.org/api/v1/users/1a5d5d87-f83a-4e3f-80ad-69f919ef5f3d', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user_email: "test@example.com",
      user_phone: "1234567890"
    })
  });
  console.log(res.status, await res.text());
}
test();
