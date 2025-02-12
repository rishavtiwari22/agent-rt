const builtInCommands = [
    { command: "open google", url: "https://www.google.com" },
    { command: "open youtube", url: "https://www.youtube.com" },
    { command: "open chat", url: "https://chat.openai.com" },
    { command: "open gmail", url: "https://mail.google.com/" },
    { command: "open linkedin", url: "https://www.linkedin.com/" },
    { command: "open github", url: "https://github.com/" },
    { command: "open sheet", url: "https://docs.google.com/spreadsheets/u/0/" },
    { command: "open docs", url: "https://docs.google.com/document/u/0/" },
    { command: "open calendar", url: "https://calendar.google.com/" },
    { command: "open maps", url: "https://www.google.com/maps" },
    { command: "open news", url: "https://news.google.com/" },
    { command: "open amazon", url: "https://www.amazon.com/" },
    { command: "open weather", url: "https://www.weather.com/" },
    { command: "open wikipedia", url: "https://www.wikipedia.org/" },
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
        const spokenCommand = event.results[0][0].transcript.toLowerCase();
        statusDisplay.innerText = `You said: "${spokenCommand}"`;
        handleCommand(spokenCommand);
      };
      recognition.onerror = (event) => {
        statusDisplay.innerText = `Error: ${event.error}`;
      };
      recognition.onend = () => {
        isListening = false;
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
    const allCommands = getAllCommands();
    for (const item of allCommands) {
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
  