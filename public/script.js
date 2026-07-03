// ⚠️ IMPORTANT: Is URL ko apne Worker URL se replace karein
const API_URL = 'https://tirhuta-converter.workers.dev/convert';

async function convert() {
    const input = document.getElementById('inputText');
    const output = document.getElementById('outputText');
    const direction = document.getElementById('direction').value;
    const stats = document.getElementById('stats');

    if (!input.value.trim()) {
        output.textContent = '⚠️ Please enter text';
        return;
    }

    try {
        const response = await fetch(`${API_URL}?dir=${direction}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: input.value })
        });

        const data = await response.json();

        if (data.error) {
            output.textContent = '❌ Error: ' + data.error;
            return;
        }

        output.textContent = data.converted;
        stats.textContent = `Characters: ${data.converted.length} | Words: ${data.converted.trim().split(/\s+/).length}`;

    } catch (error) {
        output.textContent = '❌ Connection error: ' + error.message;
    }
}

function clearAll() {
    document.getElementById('inputText').value = '';
    document.getElementById('outputText').textContent = '';
    document.getElementById('stats').textContent = 'Characters: 0 | Words: 0';
}

function copyResult() {
    const output = document.getElementById('outputText');
    if (!output.textContent) {
        alert('Nothing to copy!');
        return;
    }
    navigator.clipboard.writeText(output.textContent).then(() => {
        alert('✅ Copied!');
    }).catch(() => {
        // Fallback
        const range = document.createRange();
        range.selectNode(output);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
        document.execCommand('copy');
        alert('✅ Copied!');
    });
}

function loadExample(type) {
    const examples = {
        sanskrit: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन',
        maithili: 'सब जन सुखी होथि सब रोग मुक्त होथि',
        conjuncts: 'क्षत्रिय संस्कृत प्रश्न स्थान स्पष्ट'
    };
    document.getElementById('inputText').value = examples[type] || '';
    document.getElementById('outputText').textContent = '';
    convert();
}

// Ctrl+Enter se convert
document.getElementById('inputText').addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.ctrlKey) convert();
});

// Direction change par auto-convert
document.getElementById('direction').addEventListener('change', () => {
    if (document.getElementById('inputText').value) convert();
});
