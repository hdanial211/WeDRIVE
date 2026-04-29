/**
 * WeDRIVE - Admin Chatbot Settings JS
 * admin/js/chatbot-admin.js
 */

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const settings = await window.WeDriveAPI.getChatbotSettings();
        
        document.getElementById('cb-greeting').value = settings.greeting || '';
        document.getElementById('cb-available').value = settings.replies?.available || '';
        document.getElementById('cb-recommend').value = settings.replies?.recommend || '';
        document.getElementById('cb-book').value = settings.replies?.book || '';
        document.getElementById('cb-payment').value = settings.replies?.payment || '';
        document.getElementById('cb-default').value = settings.replies?.default || '';
        
    } catch (e) {
        console.error("Failed to load chatbot settings", e);
    }
});

window.saveChatbotSettings = async function() {
    const btn = document.querySelector('.btn-save');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<span class="material-icons-round" style="font-size: 18px;">autorenew</span> Saving...';
    btn.disabled = true;
    
    const newSettings = {
        greeting: document.getElementById('cb-greeting').value,
        replies: {
            available: document.getElementById('cb-available').value,
            recommend: document.getElementById('cb-recommend').value,
            book: document.getElementById('cb-book').value,
            payment: document.getElementById('cb-payment').value,
            default: document.getElementById('cb-default').value
        }
    };
    
    try {
        await window.WeDriveAPI.updateChatbotSettings(newSettings);
        
        // Show toast
        const toast = document.getElementById('toast');
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    } catch (e) {
        console.error("Failed to save settings", e);
        alert("Failed to save settings.");
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
};
