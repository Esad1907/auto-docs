import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FEEDBACK_EMAIL = "autoinseratai@gmail.com";

type FeedbackRequestBody = {
  name?: string;
  email?: string;
  feedback: string;
};

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "E-Mail-Versand ist nicht konfiguriert (RESEND_API_KEY fehlt)." },
      { status: 500 }
    );
  }

  let body: FeedbackRequestBody;

  try {
    body = (await request.json()) as FeedbackRequestBody;
  } catch {
    return NextResponse.json(
      { error: "Ungültiger Request-Body." },
      { status: 400 }
    );
  }

  const { name, email, feedback } = body;

  if (!feedback || typeof feedback !== "string" || feedback.trim().length === 0) {
    return NextResponse.json(
      { error: "Bitte gib ein Feedback ein." },
      { status: 400 }
    );
  }

  const subject = `[AutoInseratAI Feedback] ${name ? `von ${name}` : "Anonym"}`;
  const textParts: string[] = [];
  if (name?.trim()) textParts.push(`Name: ${name.trim()}`);
  if (email?.trim()) textParts.push(`E-Mail: ${email.trim()}`);
  textParts.push("");
  textParts.push("Feedback:");
  textParts.push(feedback.trim());

  try {
    const { error } = await resend.emails.send({
      from: "AutoInseratAI Feedback <onboarding@resend.dev>",
      to: FEEDBACK_EMAIL,
      subject,
      text: textParts.join("\n"),
    });

    if (error) {
      console.error("Resend-Fehler:", error);
      return NextResponse.json(
        { error: "E-Mail konnte nicht gesendet werden." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Unerwarteter Fehler beim E-Mail-Versand:", err);
    return NextResponse.json(
      { error: "Unerwarteter Fehler beim Senden." },
      { status: 500 }
    );
  }
}
