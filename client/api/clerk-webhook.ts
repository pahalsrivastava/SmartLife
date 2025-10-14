import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Webhook } from "svix";
import fetch from "node-fetch"; 

export const config = {
  api: {
    bodyParser: false, 
  },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const payload = await new Promise<string>((resolve) => {
    let data = "";
    req.on("data", (chunk) => (data += chunk));
    req.on("end", () => resolve(data));
  });

  console.log("Webhook invoked!");
  console.log("Raw payload:", payload);
  console.log("Headers:", req.headers);

  const svixId = req.headers["svix-id"] as string;
  const svixTimestamp = req.headers["svix-timestamp"] as string;
  const svixSignature = req.headers["svix-signature"] as string;
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET as string;

  let event: any;

  try {
    if (process.env.NODE_ENV === "production") {
      if (!svixId || !svixTimestamp || !svixSignature) {
        return res.status(400).json({ error: "Missing headers" });
      }

      if (!webhookSecret) {
        return res.status(500).json({ error: "Webhook secret not set" });
      }

      const wh = new Webhook(webhookSecret);
      event = wh.verify(payload, {
        "svix-id": svixId,
        "svix-timestamp": svixTimestamp,
        "svix-signature": svixSignature,
      });
    } else {
      event = JSON.parse(payload);
    }
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return res.status(400).json({ error: "Invalid signature" });
  }

  console.log("Verified event:", event);

  if (event.type === "user.created") {
    const user = event.data as any;
    const email = user.email_addresses?.[0]?.email_address || "";
    const name = `${user.first_name || ""} ${user.last_name || ""}`.trim();

    console.log(`Inserting user: ${email} / ${name}`);

    try {
      const HASURA_URL = process.env.HASURA_GRAPHQL_URL as string;
      const HASURA_ADMIN_SECRET = process.env.HASURA_ADMIN_SECRET as string;

      if (HASURA_URL && HASURA_ADMIN_SECRET) {
        const mutation = `
          mutation InsertUser($id: uuid!, $email: String!, $name: String!) {
            insert_users_one(object: {id: $id, email: $email, name: $name}) {
              id
              email
              name
            }
          }
        `;

        await fetch(HASURA_URL, {
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

        console.log(`New user inserted into Hasura: ${email}`);
      } else {
        console.log("Hasura env variables not set, skipping insertion.");
      }
    } catch (err) {
      console.error("Error inserting user into Hasura:", err);
    }
  }

  res.status(200).json({ success: true });
}
