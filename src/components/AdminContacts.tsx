import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "../utils/supabase";
import type { Session } from "@supabase/supabase-js";
import {
  Mail,
  LogOut,
  Lock,
  RefreshCw,
  Inbox,
  Check,
  Circle,
  Trash2,
  Search,
  X,
} from "lucide-react";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  company: string | null;
  message: string;
  created_at: string;
  is_read: boolean;
}

type FilterMode = "all" | "unread" | "read";

export default function AdminContacts() {
  const [session, setSession] = useState<Session | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [fetchError, setFetchError] = useState("");

  const [filterMode, setFilterMode] = useState<FilterMode>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [busyIds, setBusyIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setCheckingSession(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
      },
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) loadMessages();
  }, [session]);

  const loadMessages = async () => {
    setLoadingMessages(true);
    setFetchError("");
    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setFetchError("Failed to load messages: " + error.message);
    } else {
      setMessages(data ?? []);
    }
    setLoadingMessages(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoggingIn(true);
    setLoginError("");

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    setLoggingIn(false);

    if (error) {
      setLoginError("Incorrect email or password.");
      return;
    }
    setPassword("");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setMessages([]);
  };

  const setBusy = (id: string, busy: boolean) => {
    setBusyIds((prev) => {
      const next = new Set(prev);
      if (busy) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const toggleRead = async (msg: ContactMessage) => {
    setBusy(msg.id, true);
    const nextValue = !msg.is_read;

    // Optimistic update
    setMessages((prev) =>
      prev.map((m) => (m.id === msg.id ? { ...m, is_read: nextValue } : m)),
    );

    const { error } = await supabase
      .from("contact_messages")
      .update({ is_read: nextValue })
      .eq("id", msg.id);

    if (error) {
      // Revert on failure
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, is_read: msg.is_read } : m)),
      );
      setFetchError("Failed to update: " + error.message);
    }

    setBusy(msg.id, false);
  };

  const confirmDelete = (id: string) => setPendingDeleteId(id);
  const cancelDelete = () => setPendingDeleteId(null);

  const handleDelete = async (id: string) => {
    setBusy(id, true);
    const { error } = await supabase
      .from("contact_messages")
      .delete()
      .eq("id", id);

    if (error) {
      setFetchError("Failed to delete: " + error.message);
      setBusy(id, false);
      return;
    }

    setMessages((prev) => prev.filter((m) => m.id !== id));
    setPendingDeleteId(null);
  };

  const unreadCount = useMemo(
    () => messages.filter((m) => !m.is_read).length,
    [messages],
  );

  const visibleMessages = useMemo(() => {
    let list = messages;

    if (filterMode === "unread") list = list.filter((m) => !m.is_read);
    if (filterMode === "read") list = list.filter((m) => m.is_read);

    if (searchTerm.trim()) {
      const q = searchTerm.trim().toLowerCase();
      list = list.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.email.toLowerCase().includes(q) ||
          m.message.toLowerCase().includes(q) ||
          (m.company ?? "").toLowerCase().includes(q),
      );
    }

    return list;
  }, [messages, filterMode, searchTerm]);

  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <RefreshCw className="w-5 h-5 animate-spin text-zinc-400" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 px-6">
        <form
          onSubmit={handleLogin}
          className="bg-white border border-zinc-200 rounded-2xl shadow-sm p-8 w-full max-w-sm flex flex-col gap-5"
        >
          <div className="flex flex-col items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-xl bg-zinc-950 flex items-center justify-center text-white">
              <Lock className="w-4 h-4" />
            </div>
            <h1 className="text-sm font-bold text-zinc-900">Admin Access</h1>
          </div>

          {loginError && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3 rounded-xl">
              {loginError}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-white border border-zinc-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-white border border-zinc-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400"
            />
          </div>

          <button
            type="submit"
            disabled={loggingIn}
            className="w-full py-3 rounded-xl bg-zinc-950 text-white text-sm font-semibold hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {loggingIn ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 px-6 py-12">
      <div className="max-w-3xl mx-auto flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Inbox className="w-5 h-5 text-zinc-700" />
            <h1 className="text-lg font-bold text-zinc-900">
              Contact Submissions
            </h1>
            <span className="text-xs font-mono text-zinc-400">
              ({messages.length}{unreadCount > 0 ? `, ${unreadCount} unread` : ""})
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={loadMessages}
              disabled={loadingMessages}
              className="flex items-center gap-1.5 text-xs font-semibold text-zinc-600 hover:text-zinc-900 px-3 py-2 rounded-lg hover:bg-zinc-100 transition-colors"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${loadingMessages ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs font-semibold text-zinc-600 hover:text-rose-600 px-3 py-2 rounded-lg hover:bg-rose-50 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign out
            </button>
          </div>
        </div>

        {/* Filters + search */}
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div className="flex items-center gap-1 bg-white border border-zinc-200 rounded-xl p-1 w-fit">
            {(["all", "unread", "read"] as FilterMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setFilterMode(mode)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors capitalize cursor-pointer ${
                  filterMode === mode
                    ? "bg-zinc-950 text-white"
                    : "text-zinc-500 hover:text-zinc-900"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search name, email, message..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-zinc-200 rounded-xl pl-8 pr-8 py-2 text-xs outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {fetchError && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3 rounded-xl flex items-center justify-between gap-3">
            <span>{fetchError}</span>
            <button
              onClick={() => setFetchError("")}
              className="text-rose-400 hover:text-rose-700 shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {!loadingMessages && visibleMessages.length === 0 && !fetchError && (
          <p className="text-sm text-zinc-400 text-center py-12">
            {messages.length === 0
              ? "No submissions yet."
              : "No messages match this filter."}
          </p>
        )}

        <div className="flex flex-col gap-4">
          {visibleMessages.map((msg) => {
            const isBusy = busyIds.has(msg.id);
            const isPendingDelete = pendingDeleteId === msg.id;

            return (
              <div
                key={msg.id}
                className={`bg-white border rounded-2xl p-5 flex flex-col gap-3 transition-colors ${
                  msg.is_read
                    ? "border-zinc-200"
                    : "border-zinc-950/20 bg-zinc-50/40"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-2.5">
                    {!msg.is_read && (
                      <span
                        className="w-2 h-2 rounded-full bg-zinc-950 mt-1.5 shrink-0"
                        title="Unread"
                      />
                    )}
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-zinc-900">
                        {msg.name}
                      </span>
                      <a
                        href={`mailto:${msg.email}`}
                        className="text-xs text-zinc-500 hover:text-zinc-900 flex items-center gap-1"
                      >
                        <Mail className="w-3 h-3" />
                        {msg.email}
                      </a>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400 shrink-0">
                    {new Date(msg.created_at).toLocaleString("en-US")}
                  </span>
                </div>

                {msg.company && (
                  <span className="text-xs text-zinc-500">
                    Subject: {msg.company}
                  </span>
                )}

                <p className="text-sm text-zinc-700 leading-relaxed whitespace-pre-wrap">
                  {msg.message}
                </p>

                <div className="flex items-center justify-between gap-3 pt-2 border-t border-zinc-100">
                  <button
                    onClick={() => toggleRead(msg)}
                    disabled={isBusy}
                    className="flex items-center gap-1.5 text-xs font-semibold text-zinc-600 hover:text-zinc-900 px-2.5 py-1.5 rounded-lg hover:bg-zinc-100 transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {msg.is_read ? (
                      <>
                        <Circle className="w-3.5 h-3.5" />
                        Mark unread
                      </>
                    ) : (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        Mark read
                      </>
                    )}
                  </button>

                  {isPendingDelete ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-zinc-500">Delete this message?</span>
                      <button
                        onClick={() => handleDelete(msg.id)}
                        disabled={isBusy}
                        className="text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 px-2.5 py-1.5 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={cancelDelete}
                        disabled={isBusy}
                        className="text-xs font-semibold text-zinc-500 hover:text-zinc-800 px-2.5 py-1.5 rounded-lg hover:bg-zinc-100 transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => confirmDelete(msg.id)}
                      disabled={isBusy}
                      className="flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-rose-600 px-2.5 py-1.5 rounded-lg hover:bg-rose-50 transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  )}
                </div>
              </div>
                
            );
          })}
        </div>
      </div>
    </div>
  );
}