async function fetchProfileData() {
    try {
        console.log('Fetching profile data');
        const response = await fetch('/profile-data');
  
        if (response.status === 401) {
            throw new Error('Unauthorized: User not logged in');
        } else if (response.status === 404) {
            throw new Error('User profile not found');
        } else if (!response.ok) {
            throw new Error(`Failed to fetch profile data. Server returned status: ${response.status}`);
        }
  
        const data = await response.json();
        document.getElementById('username').textContent = data.username;
    } catch (error) {
        console.error('Error fetching profile data:', error.message);
    }
}
document.addEventListener('DOMContentLoaded', () => {
    fetchProfileData();
});
