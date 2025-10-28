import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { unauthorized } from "next/navigation";
import { OpenAI } from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});
export async function GET(request) {
    const session = await getServerSession(authOptions);
    if (!session?.accessToken) {
        return new Response( "unauthorized", { status: 401 } );
    }
    const { searchParams } = new URL(request.url);
    const maxResults = searchParams.get("maxResults") || 10;


    const res = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=${maxResults}&format=metadata&metadataHeaders=From&metadataHeaders=Subject`, {
        headers: {
            Authorization: `Bearer ${session.accessToken}`,
        },
    });
    if(!res.ok){
        const errText = await res.text();
        return Response.json({ error: `Gmail API error: ${errText}` }, { status: 500 });
    }
    const data = await res.json();
    if (!data.messages) {
      return Response.json({ emails: [] });
    }
    
    const detailedEmails = await Promise.all(
      data.messages.map(async (msg) => {
        const msgRes = await fetch(
          `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=metadata&metadataHeaders=From&metadataHeaders=Subject`,
          {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          }
        );
        if(!msgRes.ok) return null;

        const msgData = await msgRes.json();
        const headers = msgData.payload?.headers || [];

        const from = headers.find((h) => h.name === "From")?.value || "Unknown";
        const subject = headers.find((h) => h.name === "Subject")?.value || "(No Subject)";
        const snippet = msgData.snippet || "";

        return { id: msg.id, from, subject, snippet };
      })
    );

    return Response.json({ emails: detailedEmails });
}