async function test_request() {
  const url = "http://localhost:3000/sql";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Reponse status: ${response.status}`);
    }

    const result = await response.json();
    console.log(result);
  } catch (error) {
    console.error(error.message);
  }
}

test_request();
