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

      const response = await axios.post("/api/newUser", data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.status === 201) {
        console.log("response status , (201 expected)=>", response.status);
        const errMsg = document.getElementById("signup-message");
        errMsg.innerHTML = `<b>Signed Up Successfully !! </b>`;

        errMsg.style.color = "green";
        errMsg.style.marginTop = "20px";
        errMsg.style.display = "block";

        setTimeout(() => {
          errMsg.style.display = "none";
        }, 3000);

        const token = response.data.token;

        console.log("token at client side=>", token);

        // Store the token in localStorage
        localStorage.setItem("token", token);

        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }

      form.reset();

      window.location.href = "/expense.html";

      console.log(response);
    } catch (error) {
      if (error.response.status === 409) {
        console.log(
          "this is response status==(409 expected)>",
          error.response.status
        );
        const errMsg = document.getElementById("signup-message");
        errMsg.innerHTML = `<b>User Already Exists!!!</b>`;
        errMsg.style.color = "red";
        errMsg.style.fontFamily = "monospace, sans-serif";
        errMsg.style.display = "block";

        setTimeout(() => {
          errMsg.style.display = "none";
        }, 3000);

        form.reset();
      }
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

      const response = await axios.post("/api/user/login", loginData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      //
      if (response.status === 200) {
        console.log("this is response status==>", response.status);

        const token = response.data.token;

        console.log("token at client side=>", token);

        // Store the token in localStorage
        localStorage.setItem("token", token);

        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        const errMsg = document.getElementById("login-message");
        errMsg.innerHTML = `<b>Logged In Successfully !!</b>`;
        errMsg.style.color = "green";
        errMsg.style.display = "block";

        setTimeout(() => {
          errMsg.style.display = "none";
        }, 3000);
      }

      login.reset();
      console.log(response);

      window.location.href = "/expense.html";
    } catch (error) {
      if (error.response.status === 401) {
        console.log(
          "this is response status==(401 expected)>",
          error.response.status
        );
        const errMsg = document.getElementById("login-message");
        errMsg.innerHTML = `<b>Unauthorized Access </b>`;
        errMsg.style.color = "red";
        errMsg.style.display = "block";

        setTimeout(() => {
          errMsg.style.display = "none";
        }, 3000);
      } else if (error.response.status === 404) {
        console.log(
          "this is response status==(404 expected)>",
          error.response.status
        );
        const errMsg = document.getElementById("login-message");
        errMsg.innerHTML = `<b>User Not Found </b>`;
        errMsg.style.color = "red";
        errMsg.style.display = "block";

        setTimeout(() => {
          errMsg.style.display = "none";
        }, 3000);
      }

      login.reset();
    }
  });
});
