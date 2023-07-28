const CHAT_TITLE = "RAMINDU RANDENI";

function main() {
	// Open and close chat window on button click
	const coll = document.querySelector(".collapsible");
	coll.addEventListener("click", function () {
		this.classList.toggle("active");

		const content = this.nextElementSibling;

		if (content.style.maxHeight) {
			content.style.maxHeight = null;
		} else {
			content.style.maxHeight = `${content.scrollHeight}px`;
		}
	});

	// Press enter to send a message
	$("#textInput").keypress(function (e) {
		if (e.which === 13) {
			const userText = $("#textInput").val();
			sendResponse(userText);
		}
	});

	// Header buttons
	const close = document.querySelector("#close-button");
	const reset = document.querySelector("#reset-button");
	close.addEventListener("click", function () {
		document.querySelector(".content").style.maxHeight = null;
	});
	reset.addEventListener("click", resetChat);

	// Set chat title
	const title_text = document.querySelector("#chat-name");
	title_text.innerHTML = CHAT_TITLE;

	firstBotMessage();
}

// Gets the first message
function firstBotMessage() {
	const firstMessage = RESPONSES["start"]["message"];
	const starter = document.createElement("p");
	starter.className = "botText";
	starter.innerHTML = `<span>${firstMessage}</span>`;
	$("#chatbox").append(starter);
	createResponses(RESPONSES["start"]["responses"]);
}

// Gets the text text from the input box and processes it
function sendResponse(userText) {
	if (userText.trim() === "") {
		return;
	}
	const userHtml = `<p class="userText"><span>${userText}</span></p>`;

	$("#textInput").val("");
	$("#chatbox").append(userHtml);
	document.getElementById("chat-bar-bottom").scrollIntoView(true);

	const input = document.querySelector("#textInput");
	input.disabled = true;

	setTimeout(() => {
		getBotResponse(userText);
	}, 1000);
}

// Handle button press on chat bar
function sendButton() {
	const userText = $("#textInput").val();
	sendResponse(userText);
}

// Create response buttons
function createResponses(responseList) {
	const buttonContainer = document.createElement("div");
	buttonContainer.className = "responses";
	responseList.forEach((response) => {
		const button = document.createElement("button");
		button.className = "response-option";
		button.textContent = response;
		buttonContainer.appendChild(button);
	});
	$("#chatbox").append(buttonContainer);
	document.getElementById("chat-bar-bottom").scrollIntoView(true);
	responseButtonEvents();
}

// Add events to response buttons
function responseButtonEvents() {
	const responseButtons = document.querySelectorAll(".response-option");
	responseButtons.forEach((button) => {
		if (button.disabled) {
			return;
		}
		button.addEventListener(
			"click",
			sendButtonResponse.bind(null, button, responseButtons),
		);
	});
}

// Send a response when a button is clicked
function sendButtonResponse(button, buttonList) {
	const responseText = button.textContent;
	button.style.backgroundColor = "#856a41";
	sendResponse(responseText);

	buttonList.forEach((button) => {
		button.disabled = true;
	});
}

// Function to delete all messages, response buttons and resend first message
function resetChat() {
	const messages = document.querySelectorAll(".userText, .botText, .responses");
	messages.forEach((message) => {
		message.remove();
	});
	firstBotMessage();
}

// Sends specified text as bot
function sendBotMessage(text) {
	const botHtml = `<p class="botText"><span>${text}</span></p>`;
	$("#chatbox").append(botHtml);
	document.getElementById("chat-bar-bottom").scrollIntoView(true);
}

// Retrieves the response
function getBotResponse(userText) {
	let response;
	if (expect_input) {
		user_inputs[expect_input] = userText;
		response = RESPONSES[expect_input];
		const response_text = response.message.replace(
			`{${expect_input}}`,
			userText,
		);
		expect_input = null;
		sendBotMessage(response_text);
	} else {
		response = RESPONSES[userText];
		sendBotMessage(response.message);
	}

	if (response.type === "input") {
		expect_input = response.input;
		document.getElementById("textInput").disabled = false;
	} else if (response.responses) {
		createResponses(response.responses);
		document.getElementById("textInput").disabled = true;
	} else {
		sendBotMessage(RESPONSES["end"].message);
	}
}

// CHATBOT RESPONSE HANDLER

let expect_input = null;
const user_inputs = {};

const RESPONSES = {
	start: {
		message: "How can I help you virtually?",
		responses: ["Get in touch", "Available programmes"],
	},
	"Get in touch": {
		message: "Could you tell me your name first?",
		type: "input",
		input: "nameEntry",
	},
	nameEntry: {
		message: "How would you like to be contacted, {nameEntry}?",
		responses: ["Phone", "Email"],
	},
	Phone: {
		message: "What is your phone number?",
		type: "input",
		input: "phoneEntry",
	},
	phoneEntry: {
		message: "Alright, I will get in touch with you at {phoneEntry}.",
		type: "end",
	},
	Email: {
		message: "What is your email address?",
		type: "input",
		input: "emailEntry",
	},
	emailEntry: {
		message: "Alright, I will get in touch with you at {emailEntry}.",
		type: "end",
	},
	"Available programmes": {
		message:
			"I serve for two main sectors. Which suits your requirement the best?",
		responses: ["Corporate", "Personal"],
	},
	Corporate: {
		message: "Great. Here's a few options for you",
		responses: ["Leadership Training", "Sales & Negotiation"],
	},
	end: {
		message: "Live with spirit!",
	},
};

main();
