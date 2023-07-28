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
	const firstMessage = RESPONSES["starter"]["message"];
	const starter = document.createElement("p");
	starter.className = "botText";
	starter.innerHTML = `<span>${firstMessage}</span>`;
	$("#chatbox").append(starter);
	createResponses(RESPONSES["starter"]["responses"]);
}

// Retrieves the response
function sendBotResponse(userText) {
	let response_text;

	const botHtml = `<p class="botText"><span>${response_text}</span></p>`;
	$("#chatbox").append(botHtml);

	if (RESPONSES[userText]["responses"]) {
		createResponses(RESPONSES[userText]["responses"]);
	} else {
		const input = document.getQuerySelector("#textInput");
		input.disabled = false;
	}

	document.getElementById("chat-bar-bottom").scrollIntoView(true);
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
		sendBotResponse(userText);
	}, 1000);
}

// Handles sending text via button clicks
// function buttonSendText(sampleText) {
// 	const userHtml = `<p class="userText"><span>${sampleText}</span></p>`;

// 	$("#textInput").val("");
// 	$("#chatbox").append(userHtml);
// 	document.getElementById("chat-bar-bottom").scrollIntoView(true);

// 	//Uncomment this if you want the bot to respond to this buttonSendText event
// 	// setTimeout(() => {
// 	//     sendBotResponse(sampleText);
// 	// }, 1000)
// }

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

main();

// CHATBOT RESPONSE HANDLER

const RESPONSES = {
	starter: {
		message: "How can I help you virtually?",
		responses: ["Get in touch", "Available programmes"],
	},
	"Get in touch": {
		message: "Could you tell me your name first?",
		type: "input",
		expect: "nameEntry",
		response_text: "How would you like to be contacted, {name}?",
		response_options: ["Phone", "Email"],
	},
	Phone: {
		message: "What is your phone number?",
		type: "input",
		input: "phone",
		response: "Alright, I will get in touch with you at {phone}.",
		end: true,
	},
	Email: {
		message: "What is your email address?",
		type: "input",
		input: "email",
		response: "Alright, I will get in touch with you at {email}.",
		end: true,
	},
	"Available programmes": {
		message:
			"I serve for two main sectors. Which suits your requirement the best?",
		responses: ["Corporate", "Personal"],
	},
	Corporate: {
		message: "Great. Here's a few options for you",
		responses: ["Leadership Training", "Sales & Negotiation"],
		end: false,
	},
};

const user_inputs = {};
let expect_input;

function getResponse(message) {
	if (expect_input) {
		user_inputs[expect_input] = userText;
	}

	const botResponse = RESPONSES[userText];
}
