document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            // Simple toggle for mobile menu visibility
            if (navLinks.style.display === 'flex') {
                navLinks.style.display = 'none';
            } else {
                navLinks.style.display = 'flex';
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '70px';
                navLinks.style.right = '0';
                navLinks.style.background = 'white';
                navLinks.style.width = '100%';
                navLinks.style.padding = '20px';
                navLinks.style.boxShadow = '0 5px 10px rgba(0,0,0,0.1)';
            }
        });
    }

    // Prediction Logic
    const form = document.getElementById('prediction-form');
    const resultCard = document.getElementById('result-display');
    const loadingDiv = document.getElementById('loading');
    const outcomeContent = document.getElementById('outcome-content');

    const resName = document.getElementById('res-name');
    const resOutcome = document.getElementById('res-outcome');
    const resFeedback = document.getElementById('res-feedback');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get values
        const name = document.getElementById('name').value;
        const attendance = parseInt(document.getElementById('attendance').value);
        const marks = parseInt(document.getElementById('marks').value);
        const assignments = parseInt(document.getElementById('assignments').value);

        // Simple validation visualization
        if (attendance > 100 || marks > 100 || assignments > 10) {
            alert("Please enter valid scores (0-100 for marks/attendance, 0-10 for assignments)");
            return;
        }

        // Show loading state
        resultCard.classList.remove('hidden');
        loadingDiv.classList.remove('hidden');
        loadingDiv.style.display = 'block'; // Ensure visible
        outcomeContent.style.display = 'none';

        // Simulate calculation delay
        setTimeout(() => {
            // Calculate Score
            // Formula: (Attendance * 0.3) + (Marks * 0.5) + (Assignments * 10 * 0.2)
            const score = (attendance * 0.3) + (marks * 0.5) + (assignments * 10 * 0.2);

            let outcomeText = '';
            let outcomeClass = '';
            let feedbackText = '';

            if (score >= 80) {
                outcomeText = 'Good';
                outcomeClass = 'outcome-good';
                feedbackText = 'Excellent performance! Keep maintaing your consistency.';
            } else if (score >= 50) {
                outcomeText = 'Average';
                outcomeClass = 'outcome-average';
                feedbackText = 'You are doing okay, but there is room for improvement. Focus on your weaker areas.';
            } else {
                outcomeText = 'Poor';
                outcomeClass = 'outcome-poor';
                feedbackText = 'Immediate attention needed. Please consult with your mentors to improve your scores.';
            }

            // Update DOM
            resName.textContent = name;
            resOutcome.textContent = outcomeText;
            resOutcome.className = `outcome-badge ${outcomeClass}`; // Reset and add new class
            resFeedback.textContent = feedbackText;

            // Show Result
            loadingDiv.style.display = 'none';
            loadingDiv.classList.add('hidden');
            outcomeContent.style.display = 'block';

            // Smooth scroll to result on mobile
            if (window.innerWidth < 768) {
                resultCard.scrollIntoView({ behavior: 'smooth' });
            }

        }, 800); // 800ms delay for effect
    });
});
