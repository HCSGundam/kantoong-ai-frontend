// =========================================
// 1. FUNGSI "OTAK" AI UNTUK MENYAPA
// =========================================
async function generateAIGreeting() {
    if (typeof KantoongConfig === 'undefined' || !KantoongConfig.ai_greetings) return "Halo! Ada yang bisa dibantu?";
    const prompts = KantoongConfig.ai_greetings;
    const randomIndex = Math.floor(Math.random() * prompts.length);
    return prompts[randomIndex];
}

// =========================================
// 2. FUNGSI UNTUK MERENDER GELEMBUNG KE LAYAR
// =========================================
function addMessageToChat(text, sender) {
    const chatBox = document.getElementById('chatBox');
    if (!chatBox) return; // Keluar jika elemen chatBox belum ada di HTML

    const wrapper = document.createElement('div');
    wrapper.classList.add('message-wrapper', sender);

    const avatar = document.createElement('div');
    avatar.classList.add('avatar');
    
    const brandText = (typeof KantoongConfig !== 'undefined') ? KantoongConfig.brand_logo_text : 'AI';
    avatar.innerText = sender === 'ai' ? brandText : 'USER'; 

    const bubble = document.createElement('div');
    bubble.classList.add('bubble');
    
    const date = new Date();
    const timeText = date.getHours().toString().padStart(2, '0') + ':' + date.getMinutes().toString().padStart(2, '0');
    
    const doubleCheckIcon = `
        <svg style="margin-left: 2px; vertical-align: middle; margin-bottom: 2px;" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255, 255, 255, 0.7)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 6L7 17l-5-5"></path>
            <path d="M22 10l-7.5 7.5"></path>
        </svg>
    `;

    const formattedText = text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\n/g, "<br>");

    bubble.innerHTML = `
        <span class="bubble-text">${formattedText}</span>
        <span class="time-stamp">${timeText} ${sender === 'user' ? doubleCheckIcon : ''}</span>
    `;

    wrapper.appendChild(avatar);
    wrapper.appendChild(bubble);
    chatBox.appendChild(wrapper);

    chatBox.scrollTop = chatBox.scrollHeight;
}

// =========================================
// 3. TRIGGER UTAMA SAAT WEB DIBUKA
// =========================================
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(async () => {
        const aiMessage = await generateAIGreeting();
        addMessageToChat(aiMessage, 'ai');
    }, 1000);
});

// =========================================
// 4. TRIGGER TOMBOL KIRIM (Aman dari null error)
// =========================================
const tombolKirim = document.getElementById('tombolKirim');
const kolomKetik = document.getElementById('kolomKetik');

if (tombolKirim && kolomKetik) {
    tombolKirim.addEventListener('click', () => {
        const textUser = kolomKetik.value.trim();
        if (textUser !== "") {
            addMessageToChat(textUser, 'user');
            kolomKetik.value = "";
            
            setTimeout(() => {
                const aiName = (typeof KantoongConfig !== 'undefined') ? KantoongConfig.ai_name : 'AI';
                addMessageToChat(`Baik Kak, mohon tunggu sebentar ya, ${aiName} sedang mencarikan rekomendasinya... ✨`, 'ai');
            }, 1500);
        }
    });
}