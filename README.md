# InsightAI — AI-Powered Article Summarizer

InsightAI is a full-stack web application that summarizes news articles using OpenAI’s language model. It allows users to log in, input a URL, and receive a concise summary of the article. Users can view, copy, and manage their summary history in a clean, responsive dashboard.

## Features

- Summarizes any news article from a valid URL using GPT-based NLP
- User authentication via Firebase (Google and email/password)
- Personalized dashboard with summary history
- One-click copy to clipboard functionality with visual feedback
- Dark mode support with animated gradient backgrounds
- Confirmation dialog before clearing summary history
- Responsive and accessible UI designed with TailwindCSS

## Tech Stack

### Frontend
- React.js
- TailwindCSS
- React Router
- Heroicons

### Backend
- Express.js
- OpenAI API (GPT-3.5-turbo)
- Deployed on Render

### Authentication and Database
- Firebase Authentication
- Cloud Firestore for storing summaries

## Application Workflow

1. User logs in via Firebase Authentication.
2. User enters a news article URL.
3. Frontend sends the URL to the Express.js backend.
4. Backend fetches article content and sends it to the OpenAI API.
5. The OpenAI model returns a summary.
6. The summary is displayed on the dashboard and stored in Firestore.
7. Users can copy summaries or clear their history.



