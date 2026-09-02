import 'dotenv/config';

async function test() {
  const apiKey = process.env.GEMINI_API_KEYS.split(',')[0];
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: "Hello" }] }]
    })
  });
  
  if (response.ok) {
    console.log("Success with gemini-1.5-flash");
  } else {
    console.log("Failed:", await response.text());
  }

  const url35 = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`;
  const response35 = await fetch(url35, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: "Hello" }] }]
    })
  });

  if (response35.ok) {
    console.log("Success with gemini-3.5-flash");
  } else {
    console.log("Failed 3.5:", await response35.text());
  }
}

test();
