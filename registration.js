document.addEventListener('DOMContentLoaded', () => {
    console.log('Registration JS Loaded');

    const urlParams = new URLSearchParams(window.location.search);
    const alertMessage = urlParams.get('alert');
    const registrationSuccessMessage = document.getElementById('registrationSuccessMessage');

    console.log('Alert Message:', alertMessage);

    if (alertMessage && alertMessage === 'registration-successful') {
        console.log('Registration Page: Registration Successful Alert Displayed');
        registrationSuccessMessage.textContent = 'Registration successful! You can now log in.';
    }
});