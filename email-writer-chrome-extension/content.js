console.log("Email Writer Assistant content script loaded.");

async function handleAiReplyClick(event, field, aiButton) {
    event.preventDefault();
    event.stopPropagation();
    
    const currentDraftText = (field.innerText || field.textContent || "").trim();
    
    const readingPane = document.querySelector('[role="region"][aria-label="Reading pane"]') || 
                        field.closest('[data-app-section="MailReadCompose"]') || 
                        document.body;

    let completeChainText = "";

    const potentialBodyBlocks = readingPane.querySelectorAll('[class*="messageBody"], [class*="UniqueBody"], [id*="UniqueBody"], .ariaContent');
    
    if (potentialBodyBlocks.length > 0) {
        potentialBodyBlocks.forEach(el => {
            if (!el.contains(field)) {
                const clone = el.cloneNode(true);
                const noiseElements = clone.querySelectorAll('[class*="Banner"], [class*="Header"], button, [role="button"], [class*="SystemMessage"]');
                noiseElements.forEach(noise => noise.remove());

                const pureText = clone.innerText || clone.textContent || "";
                if (pureText.trim().length > 0) {
                    completeChainText += pureText.trim() + "\n\n";
                }
            }
        });
    }

    if (!completeChainText.trim()) {
        let rawScrapedText = readingPane.innerText || "";
        completeChainText = rawScrapedText
            .replace(/This mail has been sent from an external source[\s\S]*?identity\./gi, "")
            .replace(/The following recipient is outside your organization[\s\S]*?\./gi, "")
            .replace(/To:|Cc:|Bcc:|Sent:|From:|Subject:/gi, "")
            .trim();
    }

    completeChainText = completeChainText
        .split('\n')
        .map(line => line.trim())
        .filter(line => {
            if (!line) return false;
            if (line.length < 3) return false;
            if (/^(Welcome|Summarize|Send|AI Reply|No label|Reply|Forward|Delete|Archive|Mark)$/i.test(line)) return false;
            if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(line)) return false;
            return true;
        })
        .join('\n')
        .substring(0, 8000)
        .trim();

    let payloadText = completeChainText;
    if (currentDraftText.length > 0) {
        payloadText = `User Instruction/Draft:\n${currentDraftText}\n\nEmail Context Thread:\n${completeChainText}`;
    }

    const tone = "professional";

    const originalText = aiButton.innerText;
    aiButton.disabled = true;
    aiButton.innerText = "✨ Generating...";
    aiButton.style.opacity = "0.7";
    aiButton.style.cursor = "not-allowed";

    try {
        const res = await fetch('http://localhost:8080/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                emailContent: payloadText, 
                tone: tone 
            }),
        });

        if (!res.ok) {
            const textError = await res.text();
            throw new Error(`Server Status ${res.status}: ${textError}`);
        }

        const contentType = res.headers.get("content-type");
        let generatedText = "";

        if (contentType && contentType.includes("application/json")) {
            const data = await res.json();
            generatedText = data.text || data.response || data.generatedText || JSON.stringify(data);
        } else {
            generatedText = await res.text();
        }
        
        field.focus();

        const computedBg = window.getComputedStyle(field).backgroundColor;
        
        let fontColor = "#323130"; 

        const rgbValues = computedBg.match(/\d+/g);
        if (rgbValues && rgbValues.length >= 3) {
            const r = parseInt(rgbValues[0], 10);
            const g = parseInt(rgbValues[1], 10);
            const b = parseInt(rgbValues[2], 10);
            
            const brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000;
            
            if (brightness < 128) {
                fontColor = "#ffffff";
            }
        }

        const formattedHtml = generatedText
            .split('\n\n')
            .map(para => `<p style="margin: 0 0 1em 0; font-family: 'Segoe UI', sans-serif; font-size: 15px; color: ${fontColor};">${para.replace(/\n/g, '<br>')}</p>`)
            .join('');

        const responseWrapper = document.createElement('div');
        responseWrapper.className = "ai-generated-response";
        responseWrapper.setAttribute('contenteditable', 'true');
        responseWrapper.innerHTML = formattedHtml + "<br>";

        field.insertBefore(responseWrapper, field.firstChild);
        field.dispatchEvent(new Event('input', { bubbles: true }));

    } catch (error) {
        console.error("Pipeline Exception Caught:", error);
        alert(`Error: ${error.message || "Failed to process request"}`);
    } finally {
        aiButton.disabled = false;
        aiButton.innerText = originalText;
        aiButton.style.opacity = "1";
        aiButton.style.cursor = "pointer";
    }
}

function injectButton(field) {
    const composeContainer = field.closest('.iLc1q, .Mq3cC') || document.body;
    const sendButton = composeContainer.querySelector('[title*="Send"], [aria-label*="Send"]');
    
    if (!sendButton) {
        return;
    }

    const sendButtonParent = sendButton.parentElement;
    if (sendButtonParent.querySelector('.ai-send-tray-btn')) {
        return;
    }

    const aiButton = document.createElement('button');
    aiButton.className = 'ai-send-tray-btn';
    aiButton.type = 'button';
    
    aiButton.style.cssText = `
        background: #0078d4;
        color: #ffffff;
        border: 1px solid transparent;
        border-radius: 4px;
        padding: 0 16px;
        margin: 0 4px;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        height: 32px;
        box-shadow: 0 1px 2px rgba(0,0,0,0.1);
        transition: background-color 0.2s, box-shadow 0.2s;
    `;
    
    aiButton.innerText = "✨ AI Reply";

    aiButton.addEventListener('mouseenter', () => {
        if (!aiButton.disabled) aiButton.style.backgroundColor = '#005a9e';
    });
    aiButton.addEventListener('mouseleave', () => {
        if (!aiButton.disabled) aiButton.style.backgroundColor = '#0078d4';
    });

    aiButton.addEventListener('click', (event) => handleAiReplyClick(event, field, aiButton));

    sendButton.insertAdjacentElement('afterend', aiButton);
}

const observer = new MutationObserver((mutations) => {
    const textFields = document.querySelectorAll('.yz4r1.Jt4w1.HB_yS.HIuSp.fGO0P.dnzWM, [aria-label="Message body"]');
    
    textFields.forEach(field => {
        if (field.classList.contains('assistant-processed')) {
            return; 
        }

        const isReadMode = field.getAttribute('aria-readonly') === 'true' || 
                           field.getAttribute('role') === 'document' ||
                           field.closest('[data-app-section="MailRead"]');

        if (!isReadMode) {
            field.classList.add('assistant-processed');
            setTimeout(() => injectButton(field), 500);
        }
    });
});

observer.observe(document.body, { childList: true, subtree: true });
