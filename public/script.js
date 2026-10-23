const questionForm = document.getElementById("questionForm");
const questionInput = document.getElementById("question");
const askButton = document.getElementById("askButton");
const answer = document.getElementById("answer");

questionForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const question = questionInput.value.trim();

    if (!question) {
        answer.textContent = "Please enter a question.";
        return;
    }

    askButton.disabled = true;
    askButton.textContent = "Thinking...";
    answer.textContent = "Please wait, Gemini is generating an answer...";

    try {
        const response = await fetch("/ask", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ question })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Something went wrong.");
        }

        answer.textContent = data.answer;
    } catch (error) {
        answer.textContent = "Error: " + error.message;
    } finally {
        askButton.disabled = false;
        askButton.textContent = "Ask Gemini";
    }
});