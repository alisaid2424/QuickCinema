import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/clerk-sdk-node";
import { createUser, UpdateUser, deleteUser } from "@/server/actions/user";
import { User, UserRole } from "@prisma/client";
import prisma from "@/lib/db";

interface EmailAddress {
  email_address: string;
}

interface ExternalAccount {
  first_name?: string;
  last_name?: string;
  image_url?: string;
}

interface ClerkUserData {
  id: string;
  email_addresses: EmailAddress[];
  first_name?: string;
  last_name?: string;
  image_url?: string;
  profile_image_url?: string;
  external_accounts?: ExternalAccount[];
  public_metadata?: {
    role?: string;
    phone?: string;
  };
}

function extractUserData(data: ClerkUserData): Partial<User> {
  const email = data.email_addresses?.[0]?.email_address ?? null;
  const externalAccount = data.external_accounts?.[0] ?? {};

  const firstName = data.first_name ?? externalAccount.first_name ?? "";
  const lastName = data.last_name ?? externalAccount.last_name ?? "";

  const image =
    data.image_url ??
    data.profile_image_url ??
    externalAccount.image_url ??
    null;

  const result: Partial<User> = {
    clerkUserId: data.id,
    email,
    name: `${firstName} ${lastName}`.trim(),
    image,
  };

  const metadata = data.public_metadata ?? {};

  if (metadata.phone) result.phone = metadata.phone;

  return result;
}

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SIGNING_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "CLERK_WEBHOOK_SIGNING_SECRET is missing in environment variables."
    );
  }

  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Missing Svix headers", { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return new Response("Invalid webhook signature", { status: 400 });
  }

  const eventType = evt.type;
  const eventData = evt.data as ClerkUserData;

  try {
    switch (eventType) {
      case "user.created": {
        if (!eventData.id || !eventData.email_addresses) {
          return new Response("Invalid user.created data", { status: 400 });
        }

        const userData = extractUserData(eventData);

        if (!userData.email) {
          return new Response("User email is required", { status: 400 });
        }

        await createUser(userData as User);

        await clerkClient.users.updateUser(eventData.id, {
          publicMetadata: {
            role: UserRole.USER,
          },
        });

        break;
      }

      case "user.updated": {
        if (!eventData.id) {
          return new Response("Missing user id in user.updated", {
            status: 400,
          });
        }

        const userData = extractUserData(eventData);

        await UpdateUser(eventData.id, userData);

        const { id, public_metadata } = eventData;
        const role = public_metadata?.role as UserRole;

        if (role) {
          await prisma.user.update({
            where: { clerkUserId: id },
            data: { role },
          });

          console.log(`Role updated to ${role} for user ${id}`);
        } else {
          console.log("No role found in public_metadata.");
        }

        break;
      }

      case "user.deleted": {
        if (!eventData.id) {
          return new Response("Missing user id in user.deleted", {
            status: 400,
          });
        }

        await deleteUser(eventData.id);
        console.log("User deleted");
        break;
      }

      default:
        console.log(`Unhandled event type: ${eventType}`);
    }

    return new Response("Webhook processed", { status: 200 });
  } catch (err) {
    console.error("Error processing webhook:", err);
    return new Response("Internal server error", { status: 500 });
  }
}
