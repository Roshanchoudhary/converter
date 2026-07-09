// Import the converter logic
// Note: In browser, we'll use fetch to call the API

class ConverterUI {
    constructor() {
        this.inputText = document.getElementById('inputText');
        this.outputText = document.getElementById('outputText');
        this.charCount = document.getElementById('charCount');
        this.wordCount = document.getElementById('wordCount');
        this.direction = document.getElementById('direction');
        this.currentDirection = 'dev-to-tir';
        
        this.initEventListeners();
        this.initExamples();
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

        // Input events
        this.inputText.addEventListener('input', () => {
            this.updateStats();
        });
    }

    initExamples() {
        document.querySelectorAll('.example-item').forEach(item => {
            item.addEventListener('click', () => {
                const text = item.dataset.text;
                this.inputText.value = text;
                this.updateStats();
                // Auto-convert based on current direction
                this.convert(this.currentDirection);
            });
        });
    }

    async convert(direction) {
        const text = this.inputText.value.trim();
        if (!text) {
            this.outputText.value = 'Please enter some text to convert.';
            return;
        }

        try {
            const response = await fetch('/api/convert', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text, direction }),
            });

            const data = await response.json();
            if (data.success) {
                this.outputText.value = data.result;
                this.currentDirection = direction;
                this.updateDirection(direction);
            } else {
                this.outputText.value = 'Error: ' + data.error;
            }
        } catch (error) {
            this.outputText.value = 'Error connecting to server. Please try again.';
            console.error('Conversion error:', error);
        }
    }

    autoDetect() {
        const text = this.inputText.value.trim();
        if (!text) {
            this.outputText.value = 'Please enter some text to detect.';
            return;
        }

        // Check for Tirhuta Unicode characters (U+11480-U+114DF)
        const tirhutaRegex = /[\u{11480}-\u{114DF}]/u;
        if (tirhutaRegex.test(text)) {
            this.convert('tir-to-dev');
        } else {
            this.convert('dev-to-tir');
        }
    }

    swapText() {
        const temp = this.inputText.value;
        this.inputText.value = this.outputText.value;
        this.outputText.value = temp;
        this.updateStats();
        
        // Swap direction
        const newDirection = this.currentDirection === 'dev-to-tir' ? 'tir-to-dev' : 'dev-to-tir';
        this.currentDirection = newDirection;
        this.updateDirection(newDirection);
    }

    copyOutput() {
        const text = this.outputText.value;
        navigator.clipboard.writeText(text).then(() => {
            const btn = document.getElementById('copyBtn');
            btn.textContent = '✅ Copied!';
            setTimeout(() => {
                btn.textContent = '📋 Copy';
            }, 2000);
        }).catch(err => {
            console.error('Copy failed:', err);
            // Fallback
            this.outputText.select();
            document.execCommand('copy');
        });
    }

    clearAll() {
        this.inputText.value = '';
        this.outputText.value = '';
        this.updateStats();
    }

    updateStats() {
        const text = this.inputText.value;
        const charCount = text.length;
        const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
        this.charCount.textContent = `Characters: ${charCount}`;
        this.wordCount.textContent = `Words: ${wordCount}`;
    }

    updateDirection(direction) {
        const dirText = direction === 'dev-to-tir' ? 'Devanagari → Tirhuta' : 'Tirhuta → Devanagari';
        this.direction.textContent = `Direction: ${dirText}`;
    }
}

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ConverterUI();
});
