async function fetchProfileData() {
    try {
        console.log('Fetching profile data');
        const response = await fetch('/profile-data');

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Unauthorized: User not logged in');
            } else if (response.status === 404) {
                throw new Error('User profile not found');
            } else {
                throw new Error(`Failed to fetch profile data. Server returned status: ${response.status}`);
            }
        }

        const data = await response.json();
        document.getElementById('username').textContent = data.username;

    } catch (error) {
        console.error('Error fetching profile data:', error.message);
        // Dodaj obsługę błędu - na przykład przekieruj użytkownika na stronę logowania
        redirectToLoginPage();
    }
}

async function getServerTime() {
    const response = await fetch('/server-time');
    const data = await response.json();
    return new Date(data.serverTime);
}

const sessionTimeout = 20 * 60 * 1000;

function updateSessionTimer() {
    setInterval(async () => {
        try {
            const serverTime = await getServerTime();
            const currentTime = new Date();

            // Początkowy czas sesji
            const sessionStartTime = new Date(
                sessionStorage.sessionStartTime || serverTime
            );

            // Ustal czas ostatniej aktywności z sesji lub bieżący czas, jeśli brak aktywności
            const lastActivityTime = new Date(
                sessionStorage.lastActivityTime || currentTime
            );

            // Ustal czas wygaśnięcia sesji
            const expirationTime = new Date(
                sessionStartTime.getTime() + sessionTimeout
            );

            // Oblicz czas pozostały do wygaśnięcia sesji, ale od currentTime
            const timeRemaining = expirationTime - currentTime;

            // Wyświetl czas pozostały do końca sesji
            const minutesRemaining = Math.floor(timeRemaining / (60 * 1000));
            const secondsRemaining = Math.floor(
                (timeRemaining % (60 * 1000)) / 1000
            );

            document.getElementById('session-timer').textContent = `Time to log out: ${minutesRemaining} minutes and ${secondsRemaining} seconds`;

            // Ustaw czas ostatniej aktywności w sesji na bieżący czas
            sessionStorage.lastActivityTime = currentTime;

            // Ustaw czas początkowy sesji na bieżący czas, jeśli to pierwszy raz
            if (!sessionStorage.sessionStartTime) {
                sessionStorage.sessionStartTime = currentTime;
            }

            // Sprawdź, czy sesja wygasła
            if (timeRemaining <= 0) {
                // Sesja wygasła, przekieruj na stronę logowania
                logoutUser();
            }
        } catch (error) {
            console.error('Session time update error:', error.message);
        }
    }, 1000);
}

function checkIfLoggedIn() {
    // Dodaj kod sprawdzający, czy użytkownik jest zalogowany
    // Zwróć true, jeśli zalogowany, false w przeciwnym razie
    // Przykładowa implementacja:
    // return sessionStorage.getItem('isLoggedIn') === 'true';
    return true; // Założenie tymczasowe
}

function redirectToLoginPage() {
    // Przekieruj użytkownika na stronę logowania
    window.location.href = '/login';
}

function logoutUser() {
    // Wyczyść dane sesji i przekieruj na stronę logowania
    sessionStorage.removeItem('sessionStartTime');
    sessionStorage.removeItem('lastActivityTime');
    window.location.href = '/login?alert=session-expired';
}

document.addEventListener('DOMContentLoaded', () => {
    updateSessionTimer();

    // Dodaj event listener do przycisku wylogowywania (o ile taki przycisk istnieje)
    const logoutButton = document.getElementById('logout-link');
    if (logoutButton) {
        logoutButton.addEventListener('click', logoutUser);
    }

    // Sprawdź, czy użytkownik jest zalogowany i czy został przekierowany na stronę po udanym logowaniu
    const isLoggedIn = checkIfLoggedIn(); // Funkcja do sprawdzania, czy użytkownik jest zalogowany
    const loginSuccessful = new URLSearchParams(window.location.search).get('login-successful');

    if (loginSuccessful === 'true' && isLoggedIn) {
        // Ustaw nową sesję po udanym zalogowaniu
        sessionStorage.clear();
        sessionStorage.sessionStartTime = new Date();
    } else if (loginSuccessful === 'true' && !isLoggedIn) {
        // Błąd - użytkownik nie jest zalogowany, ale próbuje uzyskać dostęp do strony profilowej po udanym zalogowaniu
        console.error('User not logged in. Unable to create a new session after successful login.');
        redirectToLoginPage();
    }
});