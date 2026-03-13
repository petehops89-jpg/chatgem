// chat.js - Simple AI chat interface
const chatBox = document.getElementById('chat');
const input = document.getElementById('userInput');
const sendBtn = document.getElementById('send');

sendBtn.addEventListener('click', sendMessage);
input.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(); });

async function sendMessage() {
  const msg = input.value.trim();
  if (!msg) return;
  
  addMessage('You', msg);
  input.value = '';
  
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: msg })
    });
    const data = await response.json();
    addMessage('AI', data.reply);
  } catch (err) {
    addMessage('AI', 'Error: Check your backend.');
  }
}

function addMessage(sender, text) {
  const div = document.createElement('div');
  div.innerHTML = `<strong>${sender}:</strong> ${text}`;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}
