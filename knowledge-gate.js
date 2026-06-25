function addMessage(messageText, senderType) {
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message", senderType);

  messageDiv.innerHTML = messageText.replace(/\n/g, "<br>");

  const messagesContainer = document.getElementById("messages");
  messagesContainer.appendChild(messageDiv);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

document.addEventListener("DOMContentLoaded", () => {
  addMessage(
    "Hello, I am your book recommendation chatbot!\nGive me a book title, author, or topic.\n\nExample: Harry Potter",
    "bot",
  );

  document.getElementById("send-button").addEventListener("click", sendMessage);

  document.getElementById("user-input").addEventListener("keydown", (event) => {
    if (event.key === "Enter") sendMessage();
  });
});

async function sendMessage() {
  const input = document.getElementById("user-input");
  const query = input.value.trim();

  if (!query) return;

  addMessage(query, "user");
  input.value = "";

  const response = await getBookRecommendation(query);
  addMessage(response, "bot");
}

async function getBookRecommendation(query) {
  try {
    let recommendations = "";

    // ---------------- OPENLIBRARY ----------------
    const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(
      query,
    )}&limit=5`;

    const response = await fetch(url);

    if (response.ok) {
      const data = await response.json();

      if (data.docs?.length) {
        recommendations += "📚 <strong>OpenLibrary Results</strong><br><br>";

        data.docs.slice(0, 5).forEach((book) => {
          const title = book.title || "Unknown Title";
          const author = book.author_name
            ? book.author_name.join(", ")
            : "Unknown Author";
          const year = book.first_publish_year || "Unknown Year";
          const bookUrl = book.key ? `https://openlibrary.org${book.key}` : "#";

          recommendations += `<strong>${title}</strong> by ${author} (${year}) - <a href="${bookUrl}" target="_blank">More info</a><br>`;
        });

        recommendations += "<br>";
      }
    }

    // ---------------- GUTENDEX ----------------
    const gutRes = await fetch(
      `https://gutendex.com/books/?search=${encodeURIComponent(query)}`,
    );

    if (gutRes.ok) {
      const gutData = await gutRes.json();

      if (gutData.results?.length) {
        recommendations += "📖 <strong>Project Gutenberg</strong><br><br>";

        gutData.results.slice(0, 5).forEach((book) => {
          const link =
            book.formats?.["text/html"] || book.formats?.["text/plain"] || "#";

          recommendations += `
            <strong>${book.title}</strong><br>
            Author: ${
              book.authors?.map((a) => a.name).join(", ") || "Unknown"
            }<br>
            <a href="${link}" target="_blank">Read / Download</a><br><br>
          `;
        });
      } else {
        recommendations += "No Gutenberg results.<br>";
      }
    }

    return recommendations || "No books found.";
  } catch (error) {
    console.error("Error:", error);
    return "I'm sorry, something went wrong. Please try again.";
  }
}  

document.getElementById("send-button").addEventListener("click", sendMessage);

document
  .getElementById("user-input")
  .addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      sendMessage();
    }
  });
