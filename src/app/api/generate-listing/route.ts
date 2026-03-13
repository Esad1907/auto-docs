import { NextResponse } from "next/server";
import Groq from "groq-sdk";

type ListingRequestBody = {
  marke: string;
  modell: string;
  baujahr: string;
  kilometerstand: string;
  zustand: string;
  ausstattung: string;
};

export async function POST(request: Request) {
  const apiKey = process.env.GROQ_API_KEY;

  // Nur zu Debugzwecken: zeigt an, ob ein Key vorhanden ist (nicht den Key selbst)
  console.log(
    "[generate-listing] GROQ_API_KEY gesetzt:",
    apiKey ? "JA" : "NEIN"
  );

  if (!apiKey) {
    return NextResponse.json(
      { error: "GROQ_API_KEY ist nicht gesetzt." },
      { status: 500 }
    );
  }

  let body: ListingRequestBody;

  try {
    body = (await request.json()) as ListingRequestBody;
  } catch {
    return NextResponse.json(
      { error: "Ungültiger Request-Body." },
      { status: 400 }
    );
  }

  const { marke, modell, baujahr, kilometerstand, zustand, ausstattung } = body;

  const prompt = `
Erstelle ein kurzes, professionelles Fahrzeuginserat auf Deutsch mit folgender festen Struktur:

1) Überschrift:
- Eine knackige, aufmerksamkeitsstarke Überschrift in EINER Zeile.

2) Kurzbeschreibung:
- Maximal 3 Sätze, sachlich und knapp.
- Fokus NUR auf den Angaben, die explizit vom Nutzer geliefert wurden.

3) Ausstattung:
- Eine Liste mit Bullet Points (•), jede Zeile eine Ausstattungs- oder Besonderheitsinfo, ausschließlich basierend auf den eingegebenen Daten.

4) Abschluss:
- Ein kurzer, neutraler Abschlusssatz mit klarer Handlungsaufforderung (z. B. „Kontaktieren Sie mich bei Interesse.“).

Verwende ausschließlich diese Fahrzeugdaten:
- Marke: ${marke || "-"}
- Modell: ${modell || "-"}
- Baujahr: ${baujahr || "-"}
- Kilometerstand: ${kilometerstand || "-"} km
- Zustand: ${zustand || "-"}
- Ausstattung / Besonderheiten: ${ausstattung || "-"}

WICHTIG:
- Erfinde KEINE zusätzlichen Details, Eigenschaften oder Vorteile.
- Triff KEINE Annahmen über Pflegezustand, Vorbesitzer, Garantie, Unfälle, Wartung, Einsatzart oder Ähnliches.
- Verwende wirklich nur die oben aufgelisteten Informationen und formatiere sie in die beschriebene Struktur.
- Kein langer Fließtext ohne Struktur.
- Schreibe so, wie echte Inserate auf Plattformen wie mobile.de formuliert sind.
- Schreibe die Kurzbeschreibung für den Käufer: Was macht dieses konkrete Exemplar besonders? Hebe Zustand, Kilometerstand, Farbe und besondere Ausstattungsmerkmale hervor – nicht die Marke oder das Modell als solche. Das Modell steht bereits in der Überschrift.
- Beispiel: "Kaum gefahren, in seltener Sonderfarbe und mit voller M Carbon Ausstattung ab Werk – ein Fahrzeug direkt aus dem Showroom."
- Schreibe die Kurzbeschreibung wie ein echter Händler, nicht wie eine Datenzusammenfassung. Beispiel: "Kraftvoller Hochleistungssportwagen in seltener Sonderausstattung – sofort verfügbar." statt "Es handelt sich um ein Fahrzeug der Marke BMW."
`.trim();

  try {
    const groq = new Groq({ apiKey });

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content:
            "Du schreibst Fahrzeuginserate auf Deutsch im Stil eines sachlichen, erfahrenen Autohändlers: knapp, faktenorientiert, authentisch. Keine übertriebenen Adjektive. Keine Bullet Points die nur die Eingabefelder wiederholen. Schreibe die Kurzbeschreibung als echten Inseratstext – nicht als Zusammenfassung der Daten. Die Ausstattungsliste soll nur erscheinen wenn konkrete Ausstattungsmerkmale angegeben wurden, nicht Marke/Modell/Baujahr/KM/Zustand wiederholen.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3,
    });

    const content =
      completion.choices?.[0]?.message?.content?.trim() ??
      "Es konnte kein Text generiert werden.";

    return NextResponse.json({ listing: content });
  } catch (error) {
    console.error("Unerwarteter Fehler beim Groq-Aufruf:", error);
    return NextResponse.json(
      { error: "Unerwarteter Fehler beim Generieren des Inserats." },
      { status: 500 }
    );
  }
}

