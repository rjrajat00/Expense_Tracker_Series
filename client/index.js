console.log("hello from index js");

const loginForm = document.getElementById("login-form");
const signupForm = document.querySelector(".signup-form");
const loginLink = document.getElementById("login-link");
const signupLink = document.getElementById("signup-link");

loginLink.addEventListener("click", function (e) {
  e.preventDefault();
  loginForm.style.display = "block";
  signupForm.style.display = "none";
});

signupLink.addEventListener("click", function (e) {
  e.preventDefault();
  loginForm.style.display = "none";
  signupForm.style.display = "block";
});

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form");
  const showAlert = document.getElementById("showAlert");

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
        console.log("user created");
        function showAlert() {
          alert("User created");
        }
        showAlert();
      }

      const response = await axios.post("/api/newUser", data);
      form.reset();

      console.log(response);
    } catch (error) {
      console.error("Failed to send data from (client side)  ", error);
      form.reset();
    }
  });

  const login = document.getElementById("login-form");

  login.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("username").value;
    const logPassword = document.getElementById("login-password").value;

    try {
      const loginData = {
        email: email,
        logPassword: logPassword,
      };

      const response = await axios.post("/api/user/login", loginData);

      if (email && logPassword) {
        console.log("Login Successful");
        function showAlert() {
          alert("Logged In Successfully");
        }
        showAlert();
      }
      //
      if (response.status === 401) {
        console.log("this is response data==>", response.data);
        const errMsg1 = document.getElementById("error-message");
        errMsg1.innerHTML = `<b>Invalid username or password</b>`;
        errMsg1.style.color = "red";
        errMsg1.style.display = "block";

        setTimeout(() => {
          errMsg1.style.display = "none";
        }, 3000);
      } else if (response.status === 200) {
        const errMsg = document.getElementById("error-message");
        errMsg.innerHTML = `<b>Logged In Successfully  !! </b>`;
        errMsg.style.color = "green";
        errMsg.style.display = "block";

        setTimeout(() => {
          errMsg.style.display = "none";
        }, 3000);
      }

      login.reset();
      console.log(response);
    } catch (error) {
      console.error("Invalid username or password :" + error);
      login.reset();
    }
  });
});
