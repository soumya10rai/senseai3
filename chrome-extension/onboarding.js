// Onboarding script for BetterWeb Extension
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const loginToggle = document.getElementById('loginToggle');
    
    let isLoginMode = false;
    
    loginToggle.addEventListener('click', function() {
        isLoginMode = !isLoginMode;
        updateFormUI();
    });
    
    function updateFormUI() {
        const formTitle = document.querySelector('.login-section h2');
        const submitBtn = document.querySelector('.btn-primary');
        const toggleText = document.querySelector('.login-options p');
        
        if (isLoginMode) {
            formTitle.textContent = 'Sign In';
            submitBtn.textContent = 'Sign In';
            toggleText.innerHTML = 'New to BetterWeb? <button id="loginToggle" class="btn-link">Sign Up</button>';
        } else {
            formTitle.textContent = 'Get Started';
            submitBtn.textContent = 'Continue';
            toggleText.innerHTML = 'Already have an account? <button id="loginToggle" class="btn-link">Sign In</button>';
        }
        
        // Re-attach event listener
        document.getElementById('loginToggle').addEventListener('click', function() {
            isLoginMode = !isLoginMode;
            updateFormUI();
        });
    }
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(loginForm);
        const userData = {
            username: formData.get('username'),
            email: formData.get('email'),
            password: formData.get('password'),
            loginMode: isLoginMode
        };
        
        // Store user data in Chrome storage
        chrome.storage.local.set({
            userData: userData,
            loginComplete: true
        }, function() {
            // Redirect to questionnaire
            window.location.href = 'questionnaire.html';
        });
    });
});