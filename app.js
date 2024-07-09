document.getElementById('generateQuestions').addEventListener('click', async () => {
    const jobTitle = document.getElementById('jobTitle').value;
    if (jobTitle) {
        const response = await fetch('/api/getQuestions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ jobTitle })
        });

        const data = await response.json();
        const questionsDiv = document.getElementById('questions');
        questionsDiv.innerHTML = '';

        data.questions.forEach(question => {
            const questionElement = document.createElement('div');
            questionElement.className = 'alert alert-secondary';
            questionElement.innerText = question;
            questionsDiv.appendChild(questionElement);
        });
    }
});
