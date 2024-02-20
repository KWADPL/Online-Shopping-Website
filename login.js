document.addEventListener('DOMContentLoaded', () => {
  console.log('Login JS Loaded');

  const urlParams = new URLSearchParams(window.location.search);
  const alertMessage = urlParams.get('alert');
  const registrationSuccessMessage = document.getElementById('registrationSuccessMessage');

  if (alertMessage && alertMessage === 'registration-successful') {
      console.log('Login Page: Registration Successful Alert Displayed');
      registrationSuccessMessage.textContent = 'Registration successful! You can now log in.';
  }
});

