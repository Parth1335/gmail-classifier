## Gmail Classifier

An AI-powered email classification web app built with Next.js.
It connects with Google OAuth and the Gmail API to securely fetch your emails and then uses OpenAI to automatically categorize them into meaningful groups like Work, Promotions, Spam, and more.

# Features

 Google OAuth Login — Securely log in using your Gmail account.

 Fetch Emails — Retrieve your latest emails through the Gmail API.

 AI Classification — Uses OpenAI’s GPT model to classify emails into:

Important

Promotions

Updates

Work

Spam

Others

 Persistent API Key — Stores your OpenAI API key locally using localStorage.

 Interactive Interface — A clean and simple UI to view, read, and filter categorized emails.

 Tech Stack

Frontend: Next.js (App Router, Client Components, Tailwind CSS)
Backend: Next.js API Routes
APIs Used:

Google OAuth

Gmail API

OpenAI API

# Setup Instructions
1 Clone the repository
git clone https://github.com/<your-github-username>/gmail-classifier.git
cd gmail-classifier

2 Install dependencies
npm install

3 Configure environment variables

Create a file named .env.local in the project root and add the following:

GOOGLE_CLIENT_ID=your_google_client_id

GOOGLE_CLIENT_SECRET=your_google_client_secret

NEXT_PUBLIC_GOOGLE_REDIRECT_URI=http://localhost:3000

NEXTAUTH_URL=http://localhost:3000

NEXTAUTH_SECRET=your_secret

# OpenAI API Key

When you run the app, it will ask for your OpenAI API key inside the UI.
The key is stored securely in your browser’s localStorage, so you only need to enter it once.

# Google OAuth Setup

Go to Google Cloud Console
.

Create a new project and enable the Gmail API.

Configure the OAuth consent screen (choose External).

Add the following Authorized Redirect URI:

http://localhost:3000

# How It Works

The user logs in using Google OAuth.

The app fetches recent emails using the Gmail API.

The emails are sent to the backend route /api/classify, which:

Calls OpenAI’s GPT model.

Returns a clean JSON array of classified categories.

The UI then displays these categorized emails neatly for easy viewing.

Run the App
Run "npm run dev" in terminal


Once the server starts, open your browser and visit:
http://localhost:3000
