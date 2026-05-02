<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# SatyaCheck 🛡️

**SatyaCheck** is an AI-powered web application designed to combat misinformation in the digital age. Built with React and powered by the Google Gemini API, it provides robust tools for detecting deepfakes and fact-checking news across multiple languages, with a special focus on Indian regional languages (Hindi, Telugu, Tamil, etc.).

## ✨ Features

- **Deepfake Detection**: Upload media to analyze it for signs of AI manipulation, GAN/Diffusion artifacts, and digital alteration using advanced Gemini vision capabilities.
- **News Fact-Checking**: Verify claims, social media posts, and news articles in real-time. The app cross-references claims against reputable sources to provide a Veracity Score and detailed summary.
- **Multilingual Support**: Tailored for regional impact, supporting fact-checking and analysis reports in multiple Indian languages to make truth accessible to everyone.
- **Modern UI**: A responsive, beautifully designed interface built with React and modern web standards.

## 🚀 Tech Stack

- **Frontend**: React, TypeScript, Vite
- **AI Integration**: Google Gemini API (`@google/genai`)

## 🛠️ Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- A Google Gemini API Key

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/ramanjanmanchikatla/AI-deepfake-detection-and-Fact-Check-.git
   cd AI-deepfake-detection-and-Fact-Check-
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Edit the `.env.local` file in the root directory and add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_actual_api_key_here
   ```
   *(Note: If you don't set it here, the app provides a UI prompt to securely enter your key directly in the browser).*

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. **Open in Browser**:
   Navigate to the local URL provided in your terminal (usually `http://localhost:5173`) to use the application.

## 📝 License

This project is licensed under the MIT License. Built with Google Gemini.
