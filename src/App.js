import React, { useState, useEffect } from 'react';
import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, provider, db } from './firebase';
import { fetchSummary } from './api';
import {
  addDoc,
  collection,
  query,
  where,
  orderBy,
  getDocs,
  deleteDoc,
} from 'firebase/firestore';
import ClipLoader from "react-spinners/ClipLoader";

function App() {
  const [input, setInput] = useState('');
  const [summary, setSummary] = useState('');
  const [user, setUser] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleLogout = () => {
    signOut(auth);
    setUser(null);
    setHistory([]);
  };

  const handleSummarize = async () => {
    setLoading(true);
    const result = await fetchSummary(input);
    setSummary(result);
    setLoading(false);

    if (user && result) {
      await addDoc(collection(db, "summaries"), {
        url: input,
        summary: result,
        userId: user.uid,
        createdAt: new Date()
      });
      fetchHistory(user.uid);
    }
  };

  const fetchHistory = async (uid) => {
    const q = query(
      collection(db, "summaries"),
      where("userId", "==", uid),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setHistory(items);
  };

  const handleClearHistory = async () => {
    const confirm = window.confirm("Are you sure you want to delete all your summary history?");
    if (!confirm) return;

    const q = query(
      collection(db, "summaries"),
      where("userId", "==", user.uid)
    );
    const querySnapshot = await getDocs(q);
    const docs = querySnapshot.docs;

    for (const doc of docs) {
      await deleteDoc(doc.ref);
    }

    setHistory([]);
  };

  useEffect(() => {
    if (user) fetchHistory(user.uid);
  }, [user]);

  return (
    <div
      className={`min-h-screen flex flex-col items-center p-6 transition-colors duration-300 ${
        darkMode
          ? 'bg-gradient-to-br from-purple-900 via-gray-900 to-purple-800 text-white'
          : 'bg-gradient-to-br from-pink-100 via-white to-purple-100 text-gray-900'
      }`}
    >
      {/* Dark Mode Toggle - top-right absolute */}
      <div className="fixed top-4 right-6 z-50 flex items-center gap-2">
        <span className="text-sm font-bold">{darkMode ? 'Dark' : 'Light'}</span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-300 rounded-full peer dark:bg-gray-600 peer-checked:bg-blue-600 transition-all duration-300"></div>
          <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 peer-checked:translate-x-5"></div>
        </label>
      </div>

      {/* Title */}
      <div className="w-full max-w-xl relative mb-8">
        <h1 className="text-5xl font-extrabold text-blue-600 dark:text-blue-400 text-center">
          Insight-AI 🧠
        </h1>
      </div>

      {/* Login / Logout */}
      {!user ? (
        <button
          onClick={handleLogin}
          className="mb-10 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
        >
          Login with Google
        </button>
      ) : (
        <div className="flex items-center gap-4 mb-10">
          <img src={user.photoURL} alt="profile" className="w-10 h-10 rounded-full" />
          <span className="font-medium">{user.displayName}</span>
          <button
            onClick={handleLogout}
            className="ml-4 text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      )}

      {/* Greeting */}
      {user && (
        <h2 className="text-2xl font-bold italic mb-6">
          Hey, {user.displayName.split(" ")[0]} 👋
        </h2>
      )}

      {/* Input */}
      <textarea
        placeholder="Paste article link..."
        className="w-full max-w-xl h-40 p-4 border border-gray-300 dark:border-gray-600 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      {/* Summarize Button */}
      <button
        onClick={handleSummarize}
        disabled={!user}
        className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
      >
        Summarize
      </button>

      {/* Loading Spinner */}
      {loading && (
        <div className="mt-8">
          <ClipLoader color={darkMode ? "#93c5fd" : "#2563eb"} size={40} />
        </div>
      )}

      {/* Summary Output */}
      {summary && (
        <div className="mt-8 w-full max-w-xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md p-4 shadow relative">
          <h2 className="text-xl font-semibold mb-4 flex justify-between items-center text-gray-900 dark:text-white">
            Summary
            <button
              onClick={() => {
                navigator.clipboard.writeText(summary);
                alert("Copied to clipboard!");
              }}
              className="ml-2 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
              title="Copy to clipboard"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-600 dark:text-gray-200"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M8 16h8M8 12h8m-6 8h6a2 2 0 002-2V6a2 2 0 00-2-2h-6m-2 4H6a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2v-2"
                />
              </svg>
            </button>
          </h2>
          <p className="whitespace-pre-line text-gray-900 dark:text-white">{summary}</p>
        </div>
      )}

      {/* History */}
      {user && history.length > 0 && (
        <div className="mt-12 w-full max-w-xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Searched URLs</h2>
            <button
              onClick={handleClearHistory}
              className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Clear History
            </button>
          </div>

          <ul className="space-y-4">
            {history.map((item, index) => (
              <li
                key={index}
                className="bg-white dark:bg-gray-800 border dark:border-gray-600 p-4 rounded shadow text-sm"
              >
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-blue-600 dark:text-blue-400 underline break-words"
                >
                  🔗 {item.url}
                </a>
                <p className="mt-2 whitespace-pre-line text-gray-900 dark:text-white">{item.summary}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;






