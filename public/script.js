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
