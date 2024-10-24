document.addEventListener('DOMContentLoaded', function() {
    const goBackBtn = document.getElementById('goBackBtn');
    goBackBtn.addEventListener('click', function() {
        window.location.href = '../../index.html';
    });
});