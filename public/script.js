class ConverterUI {
    constructor() {
        // DOM Elements
        this.inputText = document.getElementById('inputText');
        this.outputText = document.getElementById('outputText');
        this.charCount = document.getElementById('charCount');
        this.wordCount = document.getElementById('wordCount');
        this.lineCount = document.getElementById('lineCount');
        this.direction = document.getElementById('direction');
        this.inputCount = document.getElementById('inputCount');
        this.outputCount = document.getElementById('outputCount');
        
        this.currentDirection = 'dev-to-tir';
        this.apiBase = '/api';
        this.history = [];
        this.maxHistory = 10;

        this.initEventListeners();
        this.initExamples();
        this.checkHealth();
    }

    initEventListeners() {
        // Conversion buttons
        document.getElementById('convertToTirhuta').addEventListener('click', () => {
            this.convert('dev-to-tir');
        });

        document.getElementById('convertToDevanagari').addEventListener('click', () => {
            this.convert('tir-to-dev');
        });

        document.getElementById('autoConvert').addEventListener('click', () => {
            this.autoDetect();
        });

        // Utility buttons
        document.getElementById('clearBtn').addEventListener('click', () => {
            this.clearAll();
        });

        document.getElementById('swapBtn').addEventListener('click', () => {
            this.swapText();
        });

        document.getElementById('copyBtn').addEventListener('click', () => {
            this.copyOutput();
        });

        document.getElementById('pasteBtn').addEventListener('click', () => {
            this.pasteInput();
        });

        document.getElementById('downloadBtn').addEventListener('click', () => {
            this.downloadOutput();
        });

        // Input events
        this.inputText.addEventListener('input', () => {
            this.updateStats();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Ctrl+Enter to convert
            if (e.ctrlKey && e.key === 'Enter') {
                e.preventDefault();
                this.convert(this.currentDirection);
            }
            // Ctrl+Shift+S to swap
            if (e.ctrlKey && e.shiftKey && e.key === 'S') {
                e.preventDefault();
                this.swapText();
            }
        });
    }

    initExamples() {
        document.querySelectorAll('.example-card').forEach(card => {
            card.addEventListener('click', () => {
                const text = card.dataset.text;
                this.inputText.value = text;
                this.updateStats();
                // Auto-convert based on current direction
                this.convert(this.currentDirection);
                this.showToast('📝 Example loaded!', 'success');
            });
        });
    }

    async convert(direction) {
        const text = this.inputText.value.trim();
        if (!text) {
            this.outputText.value = '⚠️ Please enter some text to convert.';
            this.showToast('⚠️ Please enter text', 'error');
            return;
        }

        // Save to history
        this.addToHistory(text, direction);

        // Show loading state
        this.outputText.value = '⏳ Converting...';
        this.outputText.style.opacity = '0.6';
        
        try {
            const response = await fetch(`${this.apiBase}/convert`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text, direction }),
            });

            const data = await response.json();
            
            if (data.success) {
                this.outputText.value = data.result;
                this.outputText.style.opacity = '1';
                this.currentDirection = direction;
                this.updateDirection(direction);
                this.updateOutputStats();
                this.showToast('✅ Conversion successful!', 'success');
            } else {
                this.outputText.value = `❌ Error: ${data.error}`;
                this.outputText.style.opacity = '1';
                this.showToast('❌ Conversion failed', 'error');
            }
        } catch (error) {
            this.outputText.value = '❌ Network error. Please check your connection.';
            this.outputText.style.opacity = '1';
            console.error('Conversion error:', error);
            this.showToast('❌ Network error', 'error');
        }
    }

    async autoDetect() {
        const text = this.inputText.value.trim();
        if (!text) {
            this.outputText.value = '⚠️ Please enter some text to detect.';
            this.showToast('⚠️ Please enter text', 'error');
            return;
        }

        // Check for Tirhuta Unicode characters (U+11480-U+114DF)
        const tirhutaRegex = /[\u{11480}-\u{114DF}]/u;
        const devanagariRegex = /[\u{0900}-\u{097F}]/u;
        
        let direction;
        if (tirhutaRegex.test(text)) {
            direction = 'tir-to-dev';
            this.showToast('🔍 Detected: Tirhuta → Devanagari', 'info');
        } else if (devanagariRegex.test(text)) {
            direction = 'dev-to-tir';
            this.showToast('🔍 Detected: Devanagari → Tirhuta', 'info');
        } else {
            this.outputText.value = '❌ Unable to detect script. Please specify direction manually.';
            this.showToast('❌ Script not detected', 'error');
            return;
        }

        this.convert(direction);
    }

    swapText() {
        const temp = this.inputText.value;
        this.inputText.value = this.outputText.value;
        this.outputText.value = temp;
        this.updateStats();
        this.updateOutputStats();
        
        // Swap direction
        const newDirection = this.currentDirection === 'dev-to-tir' ? 'tir-to-dev' : 'dev-to-tir';
        this.currentDirection = newDirection;
        this.updateDirection(newDirection);
        this.showToast('🔄 Swapped!', 'info');
    }

    async copyOutput() {
        const text = this.outputText.value;
        if (!text || text.includes('⚠️') || text.includes('❌')) {
            this.showToast('⚠️ Nothing to copy', 'error');
            return;
        }

        try {
            await navigator.clipboard.writeText(text);
            this.showToast('📋 Copied to clipboard!', 'success');
        } catch (err) {
            // Fallback
            this.outputText.select();
            document.execCommand('copy');
            this.showToast('📋 Copied!', 'success');
        }
    }

    async pasteInput() {
        try {
            const text = await navigator.clipboard.readText();
            this.inputText.value = text;
            this.updateStats();
            this.showToast('📥 Pasted!', 'success');
        } catch (err) {
            this.showToast('❌ Unable to paste', 'error');
        }
    }

    downloadOutput() {
        const text = this.outputText.value;
        if (!text || text.includes('⚠️') || text.includes('❌')) {
            this.showToast('⚠️ Nothing to download', 'error');
            return;
        }

        const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `converted-text-${Date.now()}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        this.showToast('💾 Downloaded!', 'success');
    }

    clearAll() {
        this.inputText.value = '';
        this.outputText.value = '';
        this.updateStats();
        this.updateOutputStats();
        this.showToast('🗑️ Cleared!', 'info');
    }

    updateStats() {
        const text = this.inputText.value;
        const charCount = text.length;
        const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
        const lineCount = text.split('\n').length;
        
        this.charCount.textContent = `Characters: ${charCount}`;
        this.wordCount.textContent = `Words: ${wordCount}`;
        this.lineCount.textContent = `Lines: ${lineCount}`;
        this.inputCount.textContent = charCount;
    }

    updateOutputStats() {
        const text = this.outputText.value;
        this.outputCount.textContent = text.length;
    }

    updateDirection(direction) {
        const dirMap = {
            'dev-to-tir': 'Devanagari → Tirhuta',
            'tir-to-dev': 'Tirhuta → Devanagari'
        };
        this.direction.textContent = `Direction: ${dirMap[direction] || direction}`;
    }

    addToHistory(text, direction) {
        this.history.unshift({ text, direction, timestamp: Date.now() });
        if (this.history.length > this.maxHistory) {
            this.history.pop();
        }
    }

    async checkHealth() {
        try {
            const response = await fetch(`${this.apiBase}/health`);
            const data = await response.json();
            if (data.status === 'OK') {
                console.log('✅ API is healthy:', data);
            }
        } catch (error) {
            console.warn('⚠️ API health check failed:', error);
        }
    }

    showToast(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        
        container.appendChild(toast);
        
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100px)';
            toast.style.transition = 'all 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ConverterUI();
});
