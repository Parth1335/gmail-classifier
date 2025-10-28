"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import EmailList from "./emails/components/EmailList";
import EmailReader from "./emails/components/EmailReader";
export default function Home() {
  const { data: session } = useSession();
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [maxResults, setMaxResults] = useState(15);
  const [classified, setClassified] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [openAiKey, setOpenAiKey] = useState("");
  const [keySaved, setKeySaved] = useState(false);

  useEffect(() => {
    const savedKey = localStorage.getItem("openai_api_key");
    if (savedKey) {
      setOpenAiKey(savedKey);
      setKeySaved(true);
    }
  }, []);

  const handleSaveKey = () => {
    if (!openAiKey.trim()) {
      alert("Please enter a valid OpenAI API key!");
      return;
    }
    localStorage.setItem("openai_api_key", openAiKey.trim());
    setKeySaved(true);
    alert("✅ OpenAI API key saved successfully!");
  };

  const handleClearKey = () => {
    localStorage.removeItem("openai_api_key");
    setOpenAiKey("");
    setKeySaved(false);
    alert("🗑️ OpenAI key removed!");
  };

  async function fetchEmails() {
    setLoading(true);
    setClassified(false);
    try {
      const res = await fetch(`/api/emails?maxResults=${maxResults}`);
      const data = await res.json();
      setEmails(data.emails || []);
    } catch (err) {
      console.error(err);
      alert("An error occurred while fetching emails:", err);
    } finally {
      setLoading(false);
    }
  }

  

  const classifyEmails = async () => {

    if (!openAiKey) {
      alert("Please enter and save your OpenAI API key first!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json",
        Authorization: `Bearer ${openAiKey}`,
        },
        body: JSON.stringify({ emails }),
      });
      const data = await res.json();
      if (Array.isArray(data)) {

        const updated = emails.map((email, idx) => ({
          ...email,
          category: data[idx]?.category || "Others",
        }));
        setEmails(updated);
        setClassified(true);
      }
    } catch (err) {
      console.error("Error classifying emails:", err);
    }
    setLoading(false);
  };

  const handleSelectEmail = (email) => {
    setSelectedEmail(email);
  }

  return (
    <div className="p-6 font-handwriting">
      <div
        className={`${session
          ? "flex justify-between items-center mb-6"
          : "flex justify-center items-center h-screen"
          }`}
      >
        {session ? (
          <div>
            <p className="font-semibold">{session.user.name}</p>
            <p className="text-sm text-gray-500">{session.user.email}</p>
          </div>
        ) : (
          <div />
        )}
        <button
          onClick={() => (session ? signOut() : signIn("google"))}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg text-lg font-semibold shadow-md hover:bg-blue-600 transition"
        >
          {session ? "Logout" : "Login using Google"}
        </button>
      </div>
        
        {session && (
        <div className="bg-gray-100 p-4 rounded-lg mb-6">
          <h2 className="text-lg font-semibold mb-3">OpenAI API Key</h2>

          {keySaved ? (
            <div className="flex items-center justify-between">
              <p className="text-green-600">Key saved in localStorage ✅</p>
              <button
                onClick={handleClearKey}
                className="px-3 py-1 bg-red-500 text-white rounded-lg"
              >
                Clear Key
              </button>
            </div>
          ) : (
            <div className="flex space-x-3">
              <input
                type="password"
                placeholder="Enter your OpenAI API key..."
                value={openAiKey}
                onChange={(e) => setOpenAiKey(e.target.value)}
                className="flex-1 px-3 py-2 border rounded-lg"
              />
              <button
                onClick={handleSaveKey}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg"
              >
                Save Key
              </button>
            </div>
          )}
        </div>
      )}

      {session && (
        <div className="flex items-center gap-3 mb-6">
          <select
            className="border p-2 rounded"
            value={maxResults}
            onChange={(e) => setMaxResults(Number(e.target.value))}
          >
            {[5, 10, 15, 20, 30].map((num) => (
              <option key={num} value={num}>
                {num} Emails
              </option>
            ))}
          </select>
          <button
            onClick={fetchEmails}
            disabled={loading}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            {loading ? "Fetching..." : "Fetch Emails"}
          </button>

          {emails.length > 0 && (
            <button
              onClick={classifyEmails}
              disabled={loading}
              className="border border-black px-4 py-2 rounded hover:bg-gray-100"
            >
              {loading ? "Classifying..." : classified ? "Reclassify" : "Classify"}
            </button>
          )}
        </div>
      )}
      {emails.length > 0 && <EmailList emails={emails} onSelectEmail={handleSelectEmail} />}
      <EmailReader email={selectedEmail} onClose={() => setSelectedEmail(null)} />

    </div>
  );
}
