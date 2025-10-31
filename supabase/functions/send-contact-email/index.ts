import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Mailjet from "https://esm.sh/node-mailjet@3.3.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { name, businessName, phone, email, service, message } = await req.json();

    const mailjet = new Mailjet({
      apiKey: Deno.env.get("MAILJET_API_KEY"),
      apiSecret: Deno.env.get("MAILJET_SECRET_KEY"),
    });

    const serviceMap = {
        msp: "Managed Services (MSP)",
        "app-development": "App Development",
        "web-development": "Web Development",
        "software-development": "Software Development",
        "it-consultation": "IT Consultation",
        other: "Other",
    };

    const serviceName = serviceMap[service] || "Not specified";

    const request = mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: "noreply@kirknetllc.com",
            Name: "Kirknet Contact Form",
          },
          To: [
            {
              Email: "phillip@kirknetllc.com",
              Name: "Phillip Kirk",
            },
          ],
          Subject: `New Contact Form Inquiry: ${serviceName}`,
          TextPart: `
            You have a new message from your website contact form.

            Name: ${name}
            Business: ${businessName || "N/A"}
            Email: ${email}
            Phone: ${phone}
            Service of Interest: ${serviceName}

            Message:
            ${message}
          `,
          HTMLPart: `
            <h3>New Contact Form Inquiry</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Business:</strong> ${businessName || "N/A"}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Phone:</strong> <a href="tel:${phone}">${phone}</a></p>
            <p><strong>Service of Interest:</strong> ${serviceName}</p>
            <hr>
            <p><strong>Message:</strong></p>
            <p>${message.replace(/\n/g, "<br>")}</p>
          `,
        },
      ],
    });

    await request;

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});