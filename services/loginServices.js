document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault(); 

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        // Send a POST request to the login API endpoint
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();  // Parse JSON response

        if (response.ok) {
            // Login successful
            alert('Login successful!');

            // Store token in localStorage if "Remember me" is checked
            const remember = document.getElementById('remember').checked;
            if (remember && data.token) {
                localStorage.setItem('token', data.token);
            } else if (data.token) {
                sessionStorage.setItem('token', data.token);
            }

            // Redirect to another page, e.g., home or dashboard
            window.location.href = './Public/index.html';
        } else {
            // Login failed
            alert(data.message || 'Login failed');
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('An error occurred. Please try again.');
    }
});