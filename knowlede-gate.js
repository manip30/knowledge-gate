function addMessage(messageText, senderType) {
  // 1. Create a new <div> element called messageDiv
  const messageDiv = document.createElement("div");

  // 2. Add CSS classes: 'message' and senderType ('user' or 'bot')
  messageDiv.classList.add("message", senderType);

  // 3. Replace newline characters with <br> and set as HTML content
  messageDiv.innerHTML = messageText.replace(/\n/g, "<br>");

  // 4. Get the container element with ID 'messages'
  const messagesContainer = document.getElementById("messages");

  // 5. Add messageDiv to the messages container
  messagesContainer.appendChild(messageDiv);

  // 6. Scroll to the bottom
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}
document.addEventListener("DOMContentLoaded", function () {
  addMessage(
    'Hello, I am your intelligent books recommendation chatbot "01Books".\nGive me a keyword!\n\nExample: Mathematics',
    "bot",
  );
});
document.getElementById("send-button").addEventListener("click", sendMessage);

function sendMessage() {
  const userInput = document.getElementById("user-input").value.trim();

  if (userInput) {
    addMessage(userInput, "user");
    document.getElementById("user-input").value = "";
  }
}
function addEmoji(emoji) {
  const input = document.getElementById("user-input");
  input.value += emoji;
  input.focus();
}
