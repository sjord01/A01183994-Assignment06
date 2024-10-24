//Javascript
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('studentForm');
    const formElements = ['firstname', 'lastname', 'studentid', 'password', 'date', 'courses']
        .reduce((acc, id) => ({ ...acc, [id]: document.getElementById(id) }), {});
    const togglePassword = document.getElementById('togglePassword');

    const validations = {
        required: value => value.trim() !== '',
        studentId: value => /^a0[0-9]{7}$/i.test(value),
        course: value => value !== '',
        password: value => /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?])(?!.*\s).{8,}$/.test(value),
        name: value => /^[A-Za-z'-]+(?: [A-Za-z'-]+)*$/.test(value.trim()) && value.trim().length >= 2
    };

    const errorMessages = {
        required: fieldName => `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} cannot be empty`,
        studentId: 'Invalid Student ID format',
        course: 'Please select a course',
        password: 'Password must be at least 8 characters long, include at least one uppercase letter, one lowercase letter, one number, and one symbol, with no spaces',
        name: 'Name must be at least 2 characters long, can include dashes or apostrophes, and only one space between words'
    };

    const fieldValidations = {
        firstname: ['required', 'name'],
        lastname: ['required', 'name'],
        studentid: ['required', 'studentId'],
        password: ['required', 'password'],
        date: ['required'],
        courses: ['required', 'course']
    };

    setDateRestrictions();
    togglePassword.addEventListener('click', togglePasswordVisibility);
    form.addEventListener('submit', validateForm);

    function setDateRestrictions() {
        const today = new Date().toISOString().split('T')[0];
        formElements.date.value = today;
        formElements.date.min = today;
    }

    function togglePasswordVisibility() {
        const passwordInput = formElements.password;
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;
        this.textContent = type === 'password' ? 'Show' : 'Hide';
    }

    function validateForm(e) {
        e.preventDefault();
        clearPreviousErrors();

        const isValid = Object.entries(formElements).every(([fieldName, element]) => 
            validateField(fieldName, element));

        if (isValid) form.submit();
    }

    function validateField(fieldName, element) {
        const value = element.value.trim();
        element.value = value; // Trim the value in the input
    
        const fieldValidationRules = fieldValidations[fieldName];
        const failedValidation = fieldValidationRules.find(rule => !validations[rule](value));
    
        if (failedValidation) {
            const errorMessage = failedValidation === 'required' 
                ? errorMessages.required(fieldName)
                : errorMessages[failedValidation];
            showError(element, errorMessage);
            element.classList.add('input-error');
            return false;
        }
    
        element.classList.remove('input-error');
        return true;
    }

    function showError(element, message) {
        const container = element.closest('.form-elements');
        let errorSpan = container.querySelector('.error-message') || document.createElement('span');
        errorSpan.textContent = message;
        errorSpan.className = 'error-message';
        if (!container.contains(errorSpan)) {
            container.appendChild(errorSpan);
        }
    }

    function clearPreviousErrors() {
        form.querySelectorAll('.error-message').forEach(el => el.remove());
        form.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
    }
});