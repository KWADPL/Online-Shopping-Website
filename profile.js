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
    }
}

document.addEventListener('DOMContentLoaded', fetchProfileData);


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
            const expirationTime = new Date(sessionStartTime.getTime() + sessionTimeout);

            // Oblicz czas pozostały do wygaśnięcia sesji, ale od serverTime
            const timeRemaining = expirationTime - serverTime;

            // Wyświetl czas pozostały do końca sesji
            const minutesRemaining = Math.floor(timeRemaining / (60 * 1000));
            const secondsRemaining = Math.floor((timeRemaining % (60 * 1000)) / 1000);

            document.getElementById('session-timer').textContent = `Time to log out: ${minutesRemaining} minutes and ${secondsRemaining} seconds`;

            // Ustaw czas ostatniej aktywności w sesji na bieżący czas
            sessionStorage.lastActivityTime = serverTime;

            // Ustaw czas początkowy sesji na bieżący czas, jeśli to pierwszy raz
            if (!sessionStorage.sessionStartTime) {
                sessionStorage.sessionStartTime = serverTime;
            }

            // Sprawdź, czy sesja wygasła
            if (timeRemaining <= 0) {
                // Sesja wygasła, przekieruj na stronę logowania
                window.location.href = '/login?alert=session-expired';
            }
        } catch (error) {
            console.error('Session time update error:', error.message);
        }
    }, 1000);
}
  document.addEventListener('DOMContentLoaded', () => {
    updateSessionTimer();
  });