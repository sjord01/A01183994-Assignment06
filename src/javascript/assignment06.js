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
        required: fieldName => `${fieldName} cannot be empty`,
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
            showError(element, errorMessages[failedValidation === 'required' ? 'required' : fieldName]);
            element.classList.add('error');
            return false;
        }

        element.classList.remove('error');
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
        form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
    }
});
/*
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('studentForm');
    const formElements = {
        firstname: document.getElementById('firstname'),
        lastname: document.getElementById('lastname'),
        studentid: document.getElementById('studentid'),
        password: document.getElementById('password'),
        date: document.getElementById('date'),
        courses: document.getElementById('courses'),
        togglePassword: document.getElementById('togglePassword')
    };

    const validations = {
        required: (value) => value.trim() !== '',
        studentId: (value) => /^a0[0-9]{7}$/i.test(value),
        course: (value) => value !== '',
        password: (value) => /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?])(?!.*\s).{8,}$/.test(value),
        name: (value) => /^[A-Za-z'-]+(?: [A-Za-z'-]+)*$/.test(value.trim()) && value.trim().length >= 2
    };

    const errorMessages = {
        required: (fieldName) => `${fieldName} cannot be empty`,
        studentId: 'Invalid Student ID format',
        course: 'Please select a course',
        password: 'Password must be at least 8 characters long, include at least one uppercase letter, one lowercase letter, one number, and one symbol, with no spaces',
        name: 'Name must be at least 2 characters long, can include dashes or apostrophes, and only one space between words'
    };

    // Set date input restrictions
    setDateRestrictions();

    // Toggle password visibility
    formElements.togglePassword.addEventListener('click', togglePasswordVisibility);

    // Form validation
    form.addEventListener('submit', validateForm);

    function setDateRestrictions() {
        const today = new Date().toISOString().split('T')[0];
        formElements.date.value = today;
        formElements.date.min = today;
    }

    function togglePasswordVisibility() {
        const type = formElements.password.getAttribute('type') === 'password' ? 'text' : 'password';
        formElements.password.setAttribute('type', type);
        this.textContent = type === 'password' ? 'Show' : 'Hide';
    }

    function validateForm(e) {
        e.preventDefault();
        clearPreviousErrors();

        let isValid = true;

        Object.entries(formElements).forEach(([key, element]) => {
            if (element.tagName === 'INPUT' || element.tagName === 'SELECT') {
                if (!validateField(key, element)) {
                    isValid = false;
                }
            }
        });

        if (isValid) {
            // Submit the form if all inputs are validated
            form.submit();
        }
    }

    function validateField(fieldName, element) {
        let isValid = true;
        
        // Trim whitespace from the beginning of the input value
        const trimmedValue = element.value.trim();

        if (!validations.required(trimmedValue)) {
            showError(element, errorMessages.required(fieldName));
            isValid = false;
        } else if ((fieldName === 'firstname' || fieldName === 'lastname') && !validations.name(trimmedValue)) {
            showError(element, errorMessages.name);
            isValid = false;
        } else if (fieldName === 'studentid' && !validations.studentId(trimmedValue)) {
            showError(element, errorMessages.studentId);
            isValid = false;
        } else if (fieldName === 'courses' && !validations.course(trimmedValue)) {
            showError(element, errorMessages.course);
            isValid = false;
        } else if (fieldName === 'password' && !validations.password(trimmedValue)) {
            showError(element, errorMessages.password);
            isValid = false;
        }

        element.classList.toggle('error', !isValid);
        
        // Update the element value with trimmed value to remove leading spaces
        element.value = trimmedValue;

        return isValid;
    }

    function showError(element, message) {
        let errorSpan;
        
        if (element.id === 'password') {
            const passwordContainer = element.closest('.form-elements');
            errorSpan = passwordContainer.querySelector('span') || document.createElement('span');
            errorSpan.textContent = message;
            if (!passwordContainer.contains(errorSpan)) {
                passwordContainer.appendChild(errorSpan);
            }
        } else {
            errorSpan = document.createElement('span');
            errorSpan.className = 'error-message';
            errorSpan.textContent = message;
            element.parentNode.insertBefore(errorSpan, element.nextSibling);
        }
        
        errorSpan.className = 'error-message';
    }

    function clearPreviousErrors() {
        form.querySelectorAll('.error-message').forEach(el => {
            if (el.closest('.form-elements').querySelector('#password')) {
                el.textContent = '';
                el.className = '';
            } else {
                el.remove();
            }
        });
        
        form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
    }
});
*/