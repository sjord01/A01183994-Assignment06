//Javascript

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
        course: (value) => value !== ''
    };

    const errorMessages = {
        required: (fieldName) => `${fieldName} cannot be empty`,
        studentId: 'Invalid Student ID format',
        course: 'Please select a course'
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

        const isValid = Object.entries(formElements).every(([key, element]) => {
            if (element.tagName === 'INPUT' || element.tagName === 'SELECT') {
                return validateField(key, element);
            }
            return true;
        });

        if (isValid) {
            form.submit();
        }
    }

    function validateField(fieldName, element) {
        let isValid = true;

        if (validations.required(element.value)) {
            if (fieldName === 'studentid' && !validations.studentId(element.value)) {
                showError(element, errorMessages.studentId);
                isValid = false;
            } else if (fieldName === 'courses' && !validations.course(element.value)) {
                showError(element, errorMessages.course);
                isValid = false;
            }
        } else {
            showError(element, errorMessages.required(fieldName));
            isValid = false;
        }

        element.classList.toggle('error', !isValid);
        return isValid;
    }

    function showError(element, message) {
        const errorSpan = document.createElement('span');
        errorSpan.className = 'error-message';
        errorSpan.textContent = message;
        element.parentNode.insertBefore(errorSpan, element.nextSibling);
    }

    function clearPreviousErrors() {
        form.querySelectorAll('.error-message').forEach(el => el.remove());
        form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
    }
});

/*
// Set current date and min date for date input
        const dateInput = document.getElementById('date');
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        const formattedDate = `${yyyy}-${mm}-${dd}`;
        dateInput.value = formattedDate;
        dateInput.min = formattedDate;

        // Toggle password visibility
        const togglePassword = document.getElementById('togglePassword');
        const password = document.getElementById('password');
        togglePassword.addEventListener('click', function() {
            const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
            password.setAttribute('type', type);
            this.textContent = type === 'password' ? 'Show' : 'Hide';
        });

        // Form validation
        const form = document.getElementById('studentForm');
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            let isValid = true;

            const firstname = document.getElementById('firstname');
            const lastname = document.getElementById('lastname');
            const studentid = document.getElementById('studentid');
            const courses = document.getElementById('courses');

            // Check if fields are empty
            [firstname, lastname, studentid, password].forEach(field => {
                if (!field.value.trim()) {
                    field.classList.add('error');
                    isValid = false;
                } else {
                    field.classList.remove('error');
                }
            });

            // Check course selection
            if (courses.value === "") {
                courses.classList.add('error');
                isValid = false;
            } else {
                courses.classList.remove('error');
            }

            // Validate student ID
            const studentNumberRegEx = /^a0[0-9]{7}$/i;
            if (!studentNumberRegEx.test(studentid.value)) {
                studentid.classList.add('error');
                isValid = false;
            } else {
                studentid.classList.remove('error');
            }

            if (isValid) {
                form.submit();
            } else {
                alert('Please correct the errors in the form.');
            }
        });

*/