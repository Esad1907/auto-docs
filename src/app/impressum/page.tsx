import Link from "next/link";

export default function ImpressumPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-50 px-4">
      <div className="w-full max-w-2xl bg-slate-900/80 border border-slate-800 rounded-2xl shadow-2xl shadow-black/40 p-8 backdrop-blur">
        <header className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-50">
            Impressum
          </h1>
        </header>

        <div className="space-y-4 text-sm text-slate-300">
          <p>
            <span className="font-medium text-slate-200">Name:</span> Esad Hayat
          </p>
          <p>
            <span className="font-medium text-slate-200">Adresse:</span> Friedhofstraße 2, 71299 Wimsheim
          </p>
          <p>
            <span className="font-medium text-slate-200">E-Mail:</span>{" "}
            <a
              href="mailto:autoinseratai@gmail.com"
              className="text-sky-400 hover:text-sky-300 underline underline-offset-2 transition"
            >
              autoinseratai@gmail.com
            </a>
          </p>
        </div>

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
