function checkCredentials(event) {
  event.preventDefault(); // Prevent form submission

  var username = document.getElementById("username").value;
  var password = document.getElementById("password").value;

  // Perform validation and authentication logic here
  if (username === "your_username" && password === "your_password") {
    window.location.href = "welcome.html"; // Redirect to welcome.html
  } else {
    alert("Invalid username or password.");
  }
}
