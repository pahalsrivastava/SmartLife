import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Webhook } from "svix";
import fetch from "node-fetch"; 

export const config = {
  api: {
    bodyParser: false, 
  },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const buffers: Buffer[] = [];
    for await (const chunk of req) {
      buffers.push(Buffer.from(chunk));
    }
    const payload = Buffer.concat(buffers).toString("utf8");
    const svixId = req.headers["svix-id"] as string;
    const svixTimestamp = req.headers["svix-timestamp"] as string;
    const svixSignature = req.headers["svix-signature"] as string;

    if (!svixId || !svixTimestamp || !svixSignature) {
      console.error("Missing webhook headers");
      return res.status(400).json({ error: "Missing headers" });
    }

    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET as string;
    if (!webhookSecret) {
      return res.status(500).json({ error: "Webhook secret not set" });
    }

    const wh = new Webhook(webhookSecret);
    let event: any;
    try {
      event = wh.verify(payload, {
        "svix-id": svixId,
        "svix-timestamp": svixTimestamp,
        "svix-signature": svixSignature,
      });
      console.log("✅ Verified event:", JSON.stringify(event, null, 2));
    } catch (err) {
      console.error("Webhook verification failed:", err);
      return res.status(400).json({ error: "Invalid signature" });
    }

    if (event.type === "user.created") {
      const user = event.data as any;
      const email = user.email_addresses?.[0]?.email_address || "";
      const name = `${user.first_name || ""} ${user.last_name || ""}`.trim();

      const HASURA_URL = process.env.HASURA_GRAPHQL_URL as string;
      const HASURA_ADMIN_SECRET = process.env.HASURA_ADMIN_SECRET as string;

      const mutation = `
        mutation InsertUser($id: uuid!, $email: String!, $name: String!) {
          insert_users_one(object: {id: $id, email: $email, name: $name}) {
            id
            email
            name
          }
        }
      `;

      try {
        const response = await fetch(HASURA_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-hasura-admin-secret": HASURA_ADMIN_SECRET,
          },
          body: JSON.stringify({
            query: mutation,
            variables: { id: user.id, email, name },
          }),
        });

        const data = await response.json();
        console.log("New user inserted into Hasura:", data);
      } catch (err) {
        console.error("Error inserting user into Hasura:", err);
      }
    }

    // 6️⃣ Always respond 200 to acknowledge webhook
    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Unexpected error in webhook:", err);
    res.status(500).json({ error: "Server error" });
  }
}
