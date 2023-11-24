console.log("hello from the expense HTML page");

// Function to handle premium status

document.addEventListener("DOMContentLoaded", async () => {
  const form = document.getElementById("form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const amount = document.getElementById("amount").value;
    const description = document.getElementById("description").value;
    const category = document.getElementById("category").value;

    const data = {
      amount: amount,
      description: description,
      category: category,
    };
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post("/api/expense", data, config);
      console.log("local storage token", token);

      console.log(response);

      form.reset();
      getAllExpense();
    } catch (error) {
      console.error("failed to send expense data , ", error);
    }
  });

  const getData = document.getElementById("getData");

  const getAllExpense = async () => {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.get("/api/get/expense", config);

    let expenses1 = response.data;

    console.log("expenses1=>", expenses1);

    getData.innerHTML = "Expense Details";

    expenses1.forEach((expense) => {
      try {
        const listItem = document.createElement("li");
        listItem.textContent = `Amount: ₹${expense.amount} | Description:${expense.description} | Category:${expense.category}`;

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.id = "delBtn";
        deleteBtn.classList.add("btn", "btn-danger");
        deleteBtn.dataset.expenseId = expense.id;
        deleteBtn.style.marginLeft = "20px";
        deleteBtn.style.marginTop = "20px";
        deleteBtn.style.marginBottom = "20px";

        deleteBtn.addEventListener("click", () => {
          deleteExpense(expense.id);
        });

        let editButton = document.createElement("button");
        editButton.innerText = "Edit Item";
        editButton.id = "Edit ";
        editButton.setAttribute("class", "btn btn-success");
        editButton.style.marginLeft = "15px";
        editButton.style.marginRight = "15px";
        editButton.addEventListener("click", async () => {
          await editData(expense.id);
          getAllExpense();
        });

        listItem.appendChild(editButton);
        listItem.appendChild(deleteBtn);
        getData.appendChild(listItem);
      } catch (error) {
        console.error("Error From Client side", error);
      }
    });
  };

  async function deleteExpense(expenseId) {
    try {
      const response = await axios.delete(`/api/delete/${expenseId}`);
      console.log(response.data);
      getAllExpense();
    } catch (error) {
      console.error("Unable to delete the task", error);
    }
  }

  async function editData(expenseId) {
    let updatedAmount = prompt("Enter The New Amount");
    let updatedDescription = prompt("Enter The New Description");
    let updatedCategory = prompt("Select The New Category");

    const updatedData = {
      amount: updatedAmount,
      description: updatedDescription,
      category: updatedCategory,
    };

    try {
      const response = await axios.put(`/api/edit/${expenseId}`, updatedData);
      console.log(response.data);
    } catch (error) {
      console.error("Unable to edit the expenses", error);
    }
  }

  // Check and update premium status on every login
  const isPremiumUser = await checkPremiumStatus();
  handlePremiumStatus(isPremiumUser);

  // Premium button click event
  const premium = document.getElementById("prem");
  premium.addEventListener("click", async () => {
    console.log("Premium button is clicked");
    const token = localStorage.getItem("token");

    console.log("token=>", token);

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const amount = 4900;
    try {
      const response = await axios.post("/buy/premium", { amount }, config);

      console.log("response=>", response.data.key_id);

      const { orderId, orderAmount } = response.data;
      console.log("this is the orderID=>", orderId);
      var options = {
        key: "rzp_test_FsjhNXyL5SpugN", // Replace with your actual key

        name: "Z3RO_THR3E Communications.",
        description: "Premium Membership",
        amount: orderAmount,
        image: "logo_expense_tracker_razorpay.png",
        order_id: orderId,

        handler: async function (response) {
          try {
            await axios.post(
              "/buy/update/status",
              {
                order_id: options.order_id,
                paymentId: response.razorpay_payment_id,
              },
              config
            );

            console.log("Payment status updated successfully");
          } catch (error) {
            console.error("Error updating payment status:", error);
          }
          alert("Congratulations! You are a Premium Member Now");
          window.location.reload();
        },

        callback_url: "https://eneqd3r9zrjok.x.pipedream.net/",
        theme: {
          color: "#3399cc",
        },
      };

      let rzp = new Razorpay(options);
      rzp.open();

      rzp.on("payment.failed", async (response) => {
        console.log(response);

        await axios.post(
          "/buy/update/status",
          {
            order_id: options.order_id,
            paymentId: response.razorpay_payment_id,
          },
          config
        );
      });

      console.log("this is razorpay response=>", response);
    } catch (error) {
      console.error("Error in creating orderId ", error);
    }
  });

  // Function to check premium status
  async function checkPremiumStatus() {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get("/check/premium/status", config);

      // Assuming the API response contains a property like 'isPremium'
      console.log("premium Status response=>", response);
      return response.data.isPremium;
    } catch (error) {
      console.error("Error checking premium status:", error);
      // Handle the error or return a default value
      return false;
    }
  }

  function handlePremiumStatus(isPremiumUser) {
    const premium = document.getElementById("prem");
    const premiumMember = document.getElementById("preMember");
    const normalNav = document.getElementById("normalNav");
    const premiumNav = document.getElementById("premiumNav");

    if (isPremiumUser) {
      premium.style.display = "none";
      premiumMember.style.display = "block";
      normalNav.style.display = "none";
      premiumNav.style.display = "block";
    } else {
      premium.style.display = "block";
      premiumMember.style.display = "none";
      normalNav.style.display = "block";
      premiumNav.style.display = "none";
    }
  }

  const normalLogOut = document.getElementById("logOut1");
  normalLogOut.addEventListener("click", logout);

  const premiumLogOut = document.getElementById("logOut2");
  premiumLogOut.addEventListener("click", logout);

  async function logout() {
    localStorage.removeItem("token");
    window.location.href = "/";
  }

  getAllExpense();
});
