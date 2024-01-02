console.log("Hello from Forgot Password Js");

document.addEventListener("DOMContentLoaded", () => {
  const forgotPassForm = document.getElementById("forgotPassForm");

  forgotPassForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const number = document.getElementById("number").value;

    const formData = {
      name: name,
      email: email,
      number: number,
    };
    try {
      const response = await axios.post(
        "/password/forgotpassword",
        formData,

        { headers: { "Content-Type": "application/json" } }
      );

      console.log(response);
      console.log("password recovered");

      forgotPassForm.reset();
      window.location.href = "/thankYou.html";
    } catch (error) {
      console.error("Uable to send forgot pass details", error);
      console.log(error);
    }
  });
});
