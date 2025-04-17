# LawyerUp

A modern legal tech platform that connects clients with lawyers and provides AI-powered legal document analysis.

## Features

- User Authentication with Firebase
- Lawyer Profile Management
- Client-Lawyer Matching System
- AI-Powered Document Analysis
- Real-time Chat System
- Location-based Lawyer Search
- Google Maps Integration

## Tech Stack

### Frontend

- React.js with Vite
- Tailwind CSS
- Firebase Authentication
- Google Maps API

### Backend

- Node.js
- Express.js
- MongoDB

### ML Services

- Google Gemini AI
- Groq API
- Pinecone Vector Database

## Getting Started

1. Clone the repository

```bash
git clone https://github.com/[your-username]/lawyerup.git
cd lawyerup
```

2. Install dependencies

```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install

# Functions
cd ../functions
npm install
```

3. Set up environment variables:
   Create `.env` files in respective directories with required API keys and configurations.

4. Run the development servers

```bash
# Frontend
cd frontend
npm run dev

# Backend
cd backend
npm run dev

# ML Services
cd ML/AI_DOC_ANALYSER
python app.py

cd ../CHATBOT/law
python app.py
```

## Project Structure

```
lawyerup/
├── frontend/          # React frontend
├── backend/          # Node.js backend
├── functions/        # Firebase functions
└── ML/              # Machine learning services
    ├── AI_DOC_ANALYSER/
    └── CHATBOT/
```

## Features in Detail

- 💬 **AI Chatbot Legal Assistant** – Conversational AI to answer legal queries in simple language
- 📄 **Document Analyzer** – Upload legal documents and receive summarized explanations
- 🧑‍💼 **Smart Lawyer Search** – Find lawyers based on various filters with location support
- 🗂 **Legal Document Repository** – Access commonly used legal documents
- 🧾 **User Dashboard** – Manage chats, documents, and lawyer interactions
- 🏗 **Future Roadmap** – Document generation, real-time lawyer chat, virtual court guidance

## Requirements

- Firebase Project (Firestore, Storage, Auth enabled)
- API Key for Gemini
- Pinecone vector database API Key
- Google Maps API Key

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)
