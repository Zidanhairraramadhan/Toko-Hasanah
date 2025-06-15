document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');
    const API_URL = '/api/login';

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            errorMessage.textContent = '';

            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, password })
                });

                if (response.ok) {
                    window.location.href = 'admin.html';
                } else {
                    const data = await response.json();
                    errorMessage.textContent = data.message || 'Login gagal.';
                }
            } catch (error) {
                errorMessage.textContent = 'Tidak dapat terhubung ke server.';
            }
        });
    }
});