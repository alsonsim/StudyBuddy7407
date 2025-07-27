import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
    BarChart3, Calendar, ListTodo, Users, Award,
    Settings, HelpCircle, User, LogOut, SendHorizonal
} from "lucide-react";
import { SidebarLink } from "./Dashboard";
import { db, auth } from "./firebase";
import {
    collection, addDoc, serverTimestamp,
    query, orderBy, onSnapshot
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

interface Message {
    id: string;
    sender: string;     // this is now the email
    senderId: string;
    text: string;
    timestamp?: any;
}


export default function ChatRoom() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const chatEndRef = useRef<HTMLDivElement>(null);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isLogoutOpen, setIsLogoutOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);
        });

        return () => unsubscribeAuth();
    }, []);

    useEffect(() => {
        if (loading) return;

        const q = query(collection(db, "chatMessages"), orderBy("timestamp", "asc"));

        const unsubscribe = onSnapshot(q,
            (snapshot) => {
                const msgs = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as Message[];
                setMessages(msgs);
            },
            (error) => {
                console.error("Error listening to messages:", error);
            }
        );

        return () => unsubscribe();
    }, [loading]);

    useEffect(() => {
        const interval = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);

    const sendMessage = async () => {
  if (!input.trim() || !currentUser) return;

  const newMessage = input.trim();
  setInput(""); // Clear immediately

  try {
    await addDoc(collection(db, "chatMessages"), {
      sender: currentUser.email || "NoEmail",
      senderId: currentUser.uid,
      text: newMessage,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error sending message:", error);
    // Optional: restore input on error
    setInput(newMessage);
  }
};


    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="min-h-screen flex bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 font-sans text-black">
            {/* Sidebar */}
            <aside className="w-64 bg-white/80 backdrop-blur-xl p-6 shadow-2xl border-r border-white/20 flex flex-col">
                <div className="mb-10">
                    <h2 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">StudyBuddy</h2>
                    <div className="w-12 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mt-2"></div>
                </div>

                <div className="space-y-3 mb-10">
                    <p className="text-sm font-semibold text-gray-500 uppercase">Menu</p>
                    <nav className="space-y-2 font-medium">
                        <SidebarLink icon={<BarChart3 />} label="Dashboard" onClick={() => navigate('/dashboard')} />
                        <SidebarLink icon={<ListTodo />} label="Tasks" onClick={() => navigate('/tasks')} />
                        <SidebarLink icon={<Users />} label="Start Searching" onClick={() => navigate('/match')} />
                        <SidebarLink icon={<Calendar />} label="Calendar" onClick={() => navigate('/calendar')} />
                        <SidebarLink icon={<Award />} label="Achievements" onClick={() => navigate("/achievements")} />
                    </nav>
                </div>

                <div className="mt-8 space-y-2">
                    <p className="text-sm font-semibold text-gray-500 uppercase">General</p>
                    <nav className="space-y-2 font-medium">
                        <SidebarLink icon={<Settings />} label="Settings" onClick={() => navigate('/settings')} />
                        <SidebarLink icon={<HelpCircle />} label="Help" onClick={() => navigate('/help')} />
                        <SidebarLink icon={<User />} label="Profile" onClick={() => navigate('/profile')} />
                        <button
                            onClick={() => setIsLogoutOpen(true)}
                            className="group cursor-pointer flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-gray-600 hover:bg-red-50 hover:text-red-700 w-full text-left hover:shadow-md transform hover:-translate-y-0.5"
                        >
                            <span className="text-lg text-indigo-600 group-hover:text-red-700"><LogOut /></span>
                            <span className="text-base">Log Out</span>
                        </button>
                    </nav>
                </div>

                <div className="mt-auto p-4 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl border border-indigo-200/30">
                    <p className="text-xs text-gray-500 mb-1">Current Time</p>
                    <p className="text-lg font-bold text-indigo-600">
                        {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                </div>
            </aside>

            {/* Main */}
            <main className="flex-1 p-6 flex flex-col max-h-screen overflow-hidden">
                {/* Header */}
                <header className="flex justify-between items-center bg-white/60 backdrop-blur-xl shadow-lg p-4 rounded-2xl border border-white/20 mb-6">
                    <h1 className="text-2xl font-bold text-indigo-700 flex items-center gap-2">
                        <Users size={20} /> StudyBuddy Chatroom
                    </h1>
                    <p className="text-sm text-gray-500">Group: General</p>
                </header>

                {/* Chat Feed */}
                <div className="flex-1 min-h-0 overflow-y-auto p-6 bg-white/70 backdrop-blur-xl rounded-3xl border border-white/30 shadow-lg space-y-4">
                    {messages.length === 0 ? (
                        <p className="text-gray-400 text-center mt-10">No messages yet. Start the conversation!</p>
                    ) : (
                        messages.map((msg) => {
                            const isCurrentUser = currentUser && msg.senderId === currentUser.uid;
                            return (
                                <div
                                    key={msg.id}
                                    className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
                                >
                                    <div
                                        className={`w-fit max-w-[70%] px-4 py-3 rounded-2xl shadow-md ${isCurrentUser
                                            ? "bg-indigo-600 text-white"
                                            : "bg-white text-gray-900"
                                            }`}
                                    >
                                        <p className={`text-xs font-semibold mb-1 ${isCurrentUser ? "text-white/70" : "text-indigo-500"}`}>
                                            {msg.sender}
                                        </p>
                                        <p className="text-sm break-words">{msg.text}</p>
                                    </div>
                                </div>
                            );
                        })
                    )}
                    <div ref={chatEndRef} />
                </div>

                {/* Input Box */}
                <div className="mt-6 flex items-center gap-4">
                    <input
                        type="text"
                        className="flex-1 p-4 rounded-xl border border-white/30 bg-white/80 backdrop-blur-xl shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        placeholder="Type your message..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    />
                    <button
                        onClick={sendMessage}
                        className="bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 transition-transform active:scale-95"
                        disabled={!input.trim()}
                    >
                        <SendHorizonal size={20} />
                    </button>
                </div>
            </main>
        </div>
    );
}