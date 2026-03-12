/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [listing, setListing] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setCopied(false);
    setListing(null);
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);

    const payload = {
      marke: (formData.get("marke") || "").toString(),
      modell: (formData.get("modell") || "").toString(),
      baujahr: (formData.get("baujahr") || "").toString(),
      kilometerstand: (formData.get("kilometerstand") || "").toString(),
      zustand: (formData.get("zustand") || "").toString(),
      ausstattung: (formData.get("ausstattung") || "").toString(),
    };

    try {
      const response = await fetch("/api/generate-listing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        setError(
          data?.error ||
            "Es ist ein Fehler beim Generieren des Inserats aufgetreten."
        );
        return;
      }

      const data = (await response.json()) as { listing?: string };
      setListing(data.listing ?? null);
    } catch (err) {
      console.error(err);
      setError(
        "Es ist ein unerwarteter Fehler aufgetreten. Bitte versuche es erneut."
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCopy() {
    if (!listing) return;
    try {
      await navigator.clipboard.writeText(listing);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Kopieren in die Zwischenablage fehlgeschlagen:", err);
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-50 px-4 py-8 gap-8">
      <div className="w-full max-w-2xl rounded-lg border border-amber-500/60 bg-amber-950/50 px-4 py-3 text-sm text-amber-200">
        Hinweis: Die generierten Inserate sind KI-Vorschläge. Bitte prüfe alle Angaben vor der Veröffentlichung sorgfältig.
      </div>
      <div className="w-full max-w-2xl bg-slate-900/80 border border-slate-800 rounded-2xl shadow-2xl shadow-black/40 p-8 backdrop-blur space-y-8">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-semibold tracking-tight">
            AutoInseratAI
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Erstelle ein strukturiertes Inserat für dein Fahrzeug.
          </p>
        </header>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="marke"
                className="block text-sm font-medium text-slate-200 mb-1"
              >
                Marke
              </label>
              <input
                id="marke"
                name="marke"
                type="text"
                placeholder="z. B. Volkswagen"
                className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/40 transition"
              />
            </div>

            <div>
              <label
                htmlFor="modell"
                className="block text-sm font-medium text-slate-200 mb-1"
              >
                Modell
              </label>
              <input
                id="modell"
                name="modell"
                type="text"
                placeholder="z. B. Golf 7"
                className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/40 transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="baujahr"
                className="block text-sm font-medium text-slate-200 mb-1"
              >
                Baujahr
              </label>
              <input
                id="baujahr"
                name="baujahr"
                type="number"
                placeholder="z. B. 2018"
                className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/40 transition"
              />
            </div>

            <div>
              <label
                htmlFor="kilometerstand"
                className="block text-sm font-medium text-slate-200 mb-1"
              >
                Kilometerstand
              </label>
              <input
                id="kilometerstand"
                name="kilometerstand"
                type="number"
                placeholder="z. B. 85.000"
                className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/40 transition"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="zustand"
              className="block text-sm font-medium text-slate-200 mb-1"
            >
              Zustand
            </label>
            <select
              id="zustand"
              name="zustand"
              className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/40 transition"
              defaultValue=""
            >
              <option value="" disabled>
                Bitte wählen
              </option>
              <option value="sehr-gut">Sehr gut</option>
              <option value="gut">Gut</option>
              <option value="gebraucht">Gebraucht</option>
              <option value="bastlerfahrzeug">Bastlerfahrzeug</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="ausstattung"
              className="block text-sm font-medium text-slate-200 mb-1"
            >
              Ausstattung
            </label>
            <textarea
              id="ausstattung"
              name="ausstattung"
              rows={4}
              placeholder="z. B. Klimaautomatik, Sitzheizung, Navigationssystem, LED-Scheinwerfer …"
              className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/40 transition resize-none"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center justify-center rounded-lg bg-sky-500 px-5 py-2.5 text-sm font-medium text-slate-950 shadow-lg shadow-sky-500/30 hover:bg-sky-400 disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-sky-500 focus-visible:ring-offset-slate-950 transition"
            >
              {isLoading ? "Generiere Inserat ..." : "Inserat generieren"}
            </button>
          </div>

        </form>

        {error && (
          <div className="rounded-lg border border-red-500/60 bg-red-950/40 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        {listing && (
          <section className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-lg font-medium text-slate-50">
                Generiertes Inserat
              </h2>
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center justify-center rounded-md border border-slate-600 bg-slate-800/80 px-3 py-1.5 text-xs font-medium text-slate-100 hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 transition"
              >
                {copied ? "Kopiert" : "In Zwischenablage kopieren"}
              </button>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-sm leading-relaxed text-slate-100 whitespace-pre-line">
              {listing}
            </div>
          </section>
        )}
      </div>

      <footer className="flex flex-wrap items-center justify-center gap-4 text-sm text-slate-500">
        <Link href="/impressum" className="hover:text-slate-300 transition">
          Impressum
        </Link>
        <span className="text-slate-600">·</span>
        <Link href="/datenschutz" className="hover:text-slate-300 transition">
          Datenschutz
        </Link>
        <span className="text-slate-600">·</span>
        <Link href="/feedback" className="hover:text-slate-300 transition">
          Feedback
        </Link>
      </footer>
    </main>
  );
}
