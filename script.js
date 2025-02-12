const builtInCommands = [
    { command: "open deepseek", url: "https://chat.deepseek.com/" },
    { command: "open google", url: "https://www.google.com" },
    { command: "open youtube", url: "https://www.youtube.com" },
    { command: "open chatgpt", url: "https://chat.openai.com" },
    { command: "open gmail", url: "https://mail.google.com/" },
    { command: "open linkedin", url: "https://www.linkedin.com/" },
    { command: "open github", url: "https://github.com/" },
    { command: "open hotstar", url: "https://www.hotstar.com/in/sports" },
    { command: "open vercel", url: "https://vercel.com/" },
    { command: "open sheet", url: "https://docs.google.com/spreadsheets/u/0/" },
    { command: "open docs", url: "https://docs.google.com/document/u/0/" },
    { command: "open calendar", url: "https://calendar.google.com/" },
    { command: "open maps", url: "https://www.google.com/maps" },
    { command: "open news", url: "https://news.google.com/" },
    { command: "open amazon", url: "https://www.amazon.com/" },
    { command: "open weather", url: "https://www.weather.com/" },
    { command: "open wikipedia", url: "https://www.wikipedia.org/" },
    { command: "open facebook", url: "https://www.facebook.com" },
    { command: "open instagram", url: "https://www.instagram.com" },
    { command: "open twitter", url: "https://twitter.com" },
    { command: "open netflix", url: "https://www.netflix.com/" },
    { command: "open reddit", url: "https://www.reddit.com" },
    { command: "open zoom", url: "https://zoom.us/" },
    { command: "open spotify", url: "https://www.spotify.com/" },
    { command: "open whatsapp", url: "https://web.whatsapp.com/" },
    { command: "open slack", url: "https://slack.com/" },
    { command: "open trello", url: "https://trello.com/" },
    { command: "open notion", url: "https://www.notion.so/" },
    { command: "open discord", url: "https://discord.com/" },
    { command: "open pinterest", url: "https://www.pinterest.com/" },
    { command: "open medium", url: "https://medium.com/" },
    { command: "open quora", url: "https://www.quora.com/" },
    { command: "open microsoft", url: "https://www.microsoft.com/" },
    { command: "open apple", url: "https://www.apple.com/" },
    { command: "open adobe", url: "https://www.adobe.com/" },
    { command: "open bing", url: "https://www.bing.com/" },
    { command: "open yelp", url: "https://www.yelp.com/" },
    { command: "open dropbox", url: "https://www.dropbox.com/" },
    { command: "open airbnb", url: "https://www.airbnb.com/" },
    { command: "open coursera", url: "https://www.coursera.org/" },
    { command: "open udemy", url: "https://www.udemy.com/" },
    { command: "open ebay", url: "https://www.ebay.com/" },
    { command: "open flipkart", url: "https://www.flipkart.com/" },
    { command: "open booking", url: "https://www.booking.com/" },
    { command: "open canva", url: "https://www.canva.com/" },
    { command: "open makemytrip", url: "https://www.makemytrip.com/" },
    { command: "open expedia", url: "https://www.expedia.com/" },
    { command: "open kayak", url: "https://www.kayak.com/" },
    { command: "open tripadvisor", url: "https://www.tripadvisor.com/" },
    { command: "open trivago", url: "https://www.trivago.com/" },
    { command: "open skyscanner", url: "https://www.skyscanner.net/" },
    { command: "open goibibo", url: "https://www.goibibo.com/" },
    { command: "open cleartrip", url: "https://www.cleartrip.com/" },
    { command: "open irctc", url: "https://www.irctc.co.in/nget/train-search" },
];



const STORAGE_KEY = "customCommands";
let recognition = null;
let isListening = false;

function getCustomCommands() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch (e) {
            return [];
        }
    }
    return [];
}

function saveCustomCommands(commands) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(commands));
}


function updateCustomCommandsList() {
    const listContainer = document.getElementById("customCommandsList");
    listContainer.innerHTML = "";
    const commands = getCustomCommands();
    if (commands.length === 0) {
      listContainer.innerHTML = "<p>No custom commands added.</p>";
      return;
    }
    commands.forEach((cmd, index) => {
      const parts = cmd.command.split(" ");
      const lastPart = parts[parts.length - 1];
      const div = document.createElement("div");
      div.className = "command-item";
      div.innerHTML = `<span><strong>${lastPart}</strong></span>
        <button onclick="removeCommand(${index})">Remove</button>`;
      listContainer.appendChild(div);
    });
  }


function removeCommand(index) {
    let commands = getCustomCommands();
    commands.splice(index, 1);
    saveCustomCommands(commands);
    updateCustomCommandsList();
}

function clearCustomCommands() {
    if (confirm("Are you sure you want to clear all custom commands?")) {
        localStorage.removeItem(STORAGE_KEY);
        updateCustomCommandsList();
    }
}

updateCustomCommandsList();

document.getElementById("addCommandForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const commandInput = document.getElementById("commandInput");
    const urlInput = document.getElementById("urlInput");
    const newCommand = commandInput.value.trim().toLowerCase();
    const newUrl = urlInput.value.trim();
    if (newCommand && newUrl) {
        let commands = getCustomCommands();
        commands.push({ command: newCommand, url: newUrl });
        saveCustomCommands(commands);
        updateCustomCommandsList();
        commandInput.value = "";
        urlInput.value = "";
    }
});

function getAllCommands() {
    return [...builtInCommands, ...getCustomCommands()];
}



function toggleListening() {
    const statusDisplay = document.getElementById("status");
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        statusDisplay.innerText = "Your browser does not support Speech Recognition.";
        return;
    }

    if (!isListening) {
        recognition = new SpeechRecognition();
        recognition.lang = "en-US";
        recognition.continuous = false;

        recognition.onresult = (event) => {
            let spokenCommand = event.results[0][0].transcript.toLowerCase();
            console.log("spokenCommand:", spokenCommand);
            statusDisplay.innerText = `You said: "${spokenCommand}"`;
            handleCommand(spokenCommand);
        };

        recognition.onerror = (event) => {
            statusDisplay.innerText = `Error: ${event.error}`;
        };

        recognition.onend = () => {
            isListening = false;  
            recognition = null;   
        };

        recognition.start();
        isListening = true;
        statusDisplay.innerText = "Listening for commands...";
    } else {
        recognition.stop();
        isListening = false;
        statusDisplay.innerText = "Stopped listening.";
    }
}


function handleCommand(spokenCommand) {
    const customCommands = getCustomCommands();
    const builtInCommandsList = builtInCommands;

    for (const item of customCommands) {
        if (spokenCommand.includes(item.command)) {
            window.open(item.url, "_blank");
            return;
        }
    }

    for (const item of builtInCommandsList) {
        if (spokenCommand.includes(item.command)) {
            window.open(item.url, "_blank");
            return;
        }
    }
    if (spokenCommand.includes("what is the time")) {
        const time = new Date().toLocaleTimeString();
        alert(`The current time is ${time}`);
        return;
    }

    alert("Command not recognized. Please try again.");
}


document.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && document.activeElement.tagName !== "INPUT") {
        toggleListening();
    }
});
