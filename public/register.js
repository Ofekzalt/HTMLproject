
const form = document.getElementById('registrationForm');
const fullNameField = document.getElementById('fullName');
const emailField = document.getElementById('email');
const passwordField = document.getElementById('password');
const confirmPasswordField = document.getElementById('confirmPassword');
const warningMessage = document.getElementById('warningMessage');

form.addEventListener('submit', function(event) {
    event.preventDefault();
    
    const fullName = fullNameField.value;
    const email = emailField.value;
    const password = passwordField.value;
    const confirmPassword = confirmPasswordField.value;

   
    if (password === confirmPassword) {
       
        const userData = {
            fullName: fullName,
            email: email,
            password: password 
        };

       
        const existingUsers = JSON.parse(localStorage.getItem('users')) || [];

      
        existingUsers.push(userData);

        
        localStorage.setItem('users', JSON.stringify(existingUsers));

       
        alert("Registration successful!");

        form.reset();
    } else {
       
        warningMessage.classList.remove('hidden');
    }
});
