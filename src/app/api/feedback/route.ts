import { NextResponse } from "next/server";

type FeedbackRequestBody = {
  name?: string;
  email?: string;
  feedback: string;
};

export async function POST(request: Request) {
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

  try {
    console.log("[Feedback]", {
      name: name ?? null,
      email: email ?? null,
      feedback: feedback.trim(),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Unerwarteter Fehler beim Feedback-Handler:", err);
    return NextResponse.json(
      { error: "Unerwarteter Fehler beim Verarbeiten des Feedbacks." },
      { status: 500 }
    );
  }
}
