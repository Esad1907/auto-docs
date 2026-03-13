"use client";
import { supabase } from "../supabase";
import Link from "next/link";
import { FormEvent, useState } from "react";

export default function FeedbackPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(false);
    setIsLoading(true);
  
    const formData = new FormData(event.currentTarget);
  
    try {
      const { error } = await supabase.from("feedback").insert({
        name: (formData.get("name") || "").toString().trim() || null,
        email: (formData.get("email") || "").toString().trim() || null,
        message: (formData.get("feedback") || "").toString().trim(),
      });
  
      if (error) throw error;
  
      setSuccess(true);
      (event.target as HTMLFormElement).reset();
    } catch (err) {
      console.error(err);
      setError("Es ist ein Fehler aufgetreten.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-50 px-4">
      <div className="w-full max-w-2xl bg-slate-900/80 border border-slate-800 rounded-2xl shadow-2xl shadow-black/40 p-8 backdrop-blur">
        <header className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-50">
            Feedback
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Dein Feedback hilft uns, AutoInseratAI zu verbessern.
          </p>
        </header>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-slate-200 mb-1"
            >
              Name <span className="text-slate-500">(optional)</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Dein Name"
              className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/40 transition"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-200 mb-1"
            >
              E-Mail <span className="text-slate-500">(optional)</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="deine@email.de"
              className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/40 transition"
            />
          </div>

          <div>
            <label
              htmlFor="feedback"
              className="block text-sm font-medium text-slate-200 mb-1"
            >
              Feedback
            </label>
            <textarea
              id="feedback"
              name="feedback"
              rows={5}
              required
              placeholder="Dein Feedback …"
              className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/40 transition resize-none"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center justify-center rounded-lg bg-sky-500 px-5 py-2.5 text-sm font-medium text-slate-950 shadow-lg shadow-sky-500/30 hover:bg-sky-400 disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-sky-500 focus-visible:ring-offset-slate-950 transition"
            >
              {isLoading ? "Wird gesendet …" : "Absenden"}
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-6 rounded-lg border border-red-500/60 bg-red-950/40 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-6 rounded-lg border border-emerald-500/60 bg-emerald-950/40 px-4 py-3 text-sm text-emerald-200">
            Vielen Dank für dein Feedback. Die Eingabe wurde erfasst.
          </div>
        )}

        <footer className="mt-10 pt-6 border-t border-slate-800">
          <Link
            href="/"
            className="text-sm text-slate-400 hover:text-slate-200 transition"
          >
            ← Zurück zur Startseite
          </Link>
        </footer>
      </div>
    </main>
  );
}
