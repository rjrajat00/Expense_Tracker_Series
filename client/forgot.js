console.log("Hello from Forgot Password Js");

document.addEventListener("DOMContentLoaded", () => {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const number = document.getElementById("number").value;
  const forgotPassForm = document.getElementById("forgotPassForm");

  const formData = {
    name: name,
    email: email,
    number: number,
  };

  forgotPassForm.addEventListener("submit", async () => {
    try {
      const response = await axios.post("/password/forgotpassword", formData);

      console.log(response);
      console.log("password recovered");
    } catch (error) {
      console.error("Uable to send forgot pass details", error);
    }
  });
});
