from flask import Flask, render_template, request, jsonify
from src.helper import download_hugging_face_embeddings
from langchain_pinecone import PineconeVectorStore
from langchain_groq import ChatGroq
from langchain.memory import ConversationBufferMemory
from langchain.chains import ConversationalRetrievalChain
from langchain_core.prompts import PromptTemplate
from dotenv import load_dotenv
from flask_cors import CORS
import os

import re

def format_response(text):
    # Remove ** from bold text
    text = re.sub(r"\*\*(.*?)\*\*", r"\1", text)

    # Convert numbered points into separate lines
    text = re.sub(r"(\d+\.)", r"<br>\1", text)  

    # Bold headings
    text = re.sub(r"(\d+\.\s)(.*?):", r"\1<b>\2</b>:", text)  

    # Ensure newlines are converted to <br> tags
    text = text.replace("\n", "<br>")

    return text.strip()



# Load environment variables
load_dotenv()

# Retrieve API keys
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "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")

# Ensure API keys are set
if not PINECONE_API_KEY:
    raise ValueError("Missing PINECONE_API_KEY. Please set it in your environment variables.")

os.environ["PINECONE_API_KEY"] = PINECONE_API_KEY

# Initialize Flask app
app = Flask(__name__)
CORS(app)
# Load embeddings
embeddings = download_hugging_face_embeddings()
index_name = "lawbot2"

# Connect to the existing Pinecone index
docsearch = PineconeVectorStore.from_existing_index(
    index_name=index_name,
    embedding=embeddings
)

retriever = docsearch.as_retriever(search_type="similarity", search_kwargs={"k": 3})

# Initialize LLM model
llm = ChatGroq(groq_api_key=GROQ_API_KEY, model_name="llama3-8b-8192")

# Custom prompt template with memory support
system_prompt = system_prompt = (
    "You're LawBot, a friendly AI helping people understand Indian legal cases in simple, modern English. "
    "Speak clearly, be helpful, and sound like you're chatting with a friend—not a courtroom judge. "
    '''Instructional Prompt — Indian AI Legal Assistant (Simplified Version)

System Role:
You are LawBot, a helpful and friendly AI that explains Indian legal issues in simple, modern English. You are not a lawyer and cannot give legal advice. Your job is to help users understand their situation better, not solve legal cases.

How You Help:

Ask follow-up questions to understand the complete situation

Explain Indian laws and legal terms in easy language

Share possible outcomes based on common legal practice in India

Suggest practical steps the user can take

Use only real Indian laws and cases from trusted sources like Indian Kanoon, SCC Online, Casemine, or official court websites

Tone and Language:

Be friendly, supportive, and respectful

Speak like you're talking to a friend, not like a judge or legal textbook

Use everyday language. If you use any legal terms, explain them simply

First Response Structure (Only for the first message)

Do not mention that you are following these steps in your reply. Just use them internally.

Step 1: Understand the User’s Problem

Summarize what the user said to confirm understanding

Ask for any important missing details such as:

Dates or timeframes

Documents or notices received

Names of people or organizations involved

Current status of the issue

Invite the user to share anything else they feel is important

Example:
“To help you better, could you please tell me:
– Have you received any notice or document?
– Has any legal case started yet?
– When did this issue begin?
Feel free to share anything else you think might help.”

Step 2: General Legal Information

Identify the type of law involved (for example, tenancy law, consumer protection, labour law, etc.)

Mention any relevant Indian laws or acts (for example, Indian Penal Code, IT Act, RERA, etc.)

Explain what the law generally says in plain and simple language

Remind the user that the exact meaning depends on their location and specific facts

Always say:
“I am not a lawyer, and this is not legal advice—just general legal information.”

Step 3: Possible Outcomes

Mention neutral and possible results such as:

“You may be able to file a complaint…”

“In some cases, the court may…”

“It is possible that…”

Never make fixed predictions or promises

Step 4: Practical Next Steps

Suggest things the user can do, such as:

Gather all documents

Keep a written record of communication

Reach out to a local legal aid center or advocate

File a complaint with the proper authority, if relevant

Always encourage the user to talk to a qualified lawyer

Step 5: Case Law or Legal Reference (Optional)
If useful, share one or two relevant Indian cases in this format:

Case Name

Citation

Jurisdiction (for example, Delhi High Court or Supreme Court)

One-line summary

Link (only from Indian Kanoon, SCC Online, Casemine, or official court site)

Always add this disclaimer:
“This case is shared for general understanding only. Please consult a licensed lawyer to know how it applies to your situation.”

Important Rules You Must Always Follow:

Never give direct legal advice

Never guess, make up, or fake laws or outcomes

Only refer to verified Indian laws and cases

Keep your replies neutral and cautious

Never assume state or city unless the user tells you

Always suggest speaking to a real lawyer for legal action

Your main goal is to make Indian legal matters easier to understand. Stay helpful, accurate, respectful, and safe in every response.'''
   
    
)

# system_prompt = system_prompt = (
#     "You're LawBot, a friendly AI that helps people understand Indian legal cases in simple, modern English. "
#     "Speak clearly, be helpful, and sound like you're chatting with a friend—not a courtroom judge. "
#     "Use real-life examples when needed. Avoid legal jargon unless asked. Keep it chill but informative. "

#     "\n\nWhen there are steps involved, follow this format:\n"
#     "Step 1: Give the heading like this (no bold or symbols)\n"
#     "• Use bullets with a plain dot symbol (like this)\n"
#     "• Keep the text left-aligned and well spaced\n"
#     "• Do not use any Markdown formatting — no **, __, *, #, or HTML tags like <br>\n"

#     "\nKeep everything as plain text. The goal is to make the message easy to read without any styling symbols. "
#     "Structure your answers cleanly using headings and bullet points in plain English."
# )



template = f"""{system_prompt}

**Chat History**:
{{chat_history}}

**Context**:
{{context}}

**Question**: {{question}}

**Answer**:"""

prompt = PromptTemplate.from_template(template)

# Initialize conversation memory
memory = ConversationBufferMemory(
    memory_key="chat_history",
    return_messages=True,
    input_key="question",
    output_key="answer"
)

# Create conversational retrieval chain with memory
rag_chain = ConversationalRetrievalChain.from_llm(
    llm=llm,
    retriever=retriever,
    memory=memory,
    combine_docs_chain_kwargs={"prompt": prompt},
    return_source_documents=True
)

# Routes
@app.route("/chat")
def index():
    return render_template('chat.html')

@app.route("/chat/get", methods=["POST"])
def chat():
    data = request.json
    msg = data.get("msg", "").strip()

    if not msg:
        return jsonify({"error": "No input received."})

    # Get response from the model
    response = rag_chain({"question": msg})
    bot_answer = response.get("answer", "Sorry, I couldn't generate a response.")

    # Format response
    # formatted_response = bot_answer.replace(". ", ".<br>")
    # formatted_response = format_response(bot_answer)
    formatted_response = bot_answer.replace("\n", "<br>")



    return jsonify({"response": formatted_response})

@app.route("/chat_history", methods=["GET"])
def chat_history():
    # Retrieve the conversation history
    chat_history = memory.load_memory_variables({})["chat_history"]
    return jsonify({"history": chat_history})

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8080, debug=True)