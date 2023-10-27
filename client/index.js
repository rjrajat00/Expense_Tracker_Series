console.log("hello from index js");

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const data = {
        name: name,
        email: email,
        password: password,
      };

      if (email) {
        console.log("user Already exists");
      }

      const response = await axios.post("/api/newUser", data);
      form.reset();

      console.log(response);
    } catch (error) {
      console.error("Failed to send data from (client side)");
      form.reset();
    }
  });
});
