const chatBox = document.querySelector(".chat-box")
const typingForm = document.querySelector(".typing-form")
 
const API_KEY = "AIzaSyA2-CTAIaInb0NeJurJS9-Uhn72Qrcj97E";
const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`;

let message =null;


async function getResponse(message) {
    try{
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    role: "user",
                    parts: [{ text: message }]
                }]
            })
        });
        const data = await response.json();
        return data;
    }  
    catch (error){
        console.log(error);
    }  
}

const createMessageElement = (content, ...classes) => {
    const div = document.createElement("div"); 
    div.classList.add("message", ...classes); 
    div.innerHTML = content; 
    return div; 
}

const handleOutgoingChat = async () => {
    message = typingForm.querySelector(".input").value.trim(); 
    if (!message) return;

   
    const outgoingMessageDiv = createMessageElement(`<p class="text">${message}</p>`, "outgoing");
    chatBox.appendChild(outgoingMessageDiv);
    chatBox.scrollTo(0, chatBox.scrollHeight);

    
    const response = await getResponse(message);
    if (response) {
        const botMessage = response?.candidates[0]?.content?.parts[0]?.text.replace(/\*\*(.*?)\*\*/g, '$1');
        const incomingMessageDiv = createMessageElement(`<p class="text" style="color: rgb(37, 68, 114)">${botMessage}</p>`, "incoming");
        chatBox.appendChild(incomingMessageDiv);
        chatBox.scrollTo(0, chatBox.scrollHeight);
    }    typingForm.reset(); 
};


typingForm.addEventListener('submit', (e) => {
    e.preventDefault(); 

    handleOutgoingChat();
});