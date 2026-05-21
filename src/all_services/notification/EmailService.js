export async function sendEmail(to, text) {
  try {
    await fetch("https://httpbin.org/post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ to, text })
    });
  } catch (error) {
    console.log("Email failed");
  }
}