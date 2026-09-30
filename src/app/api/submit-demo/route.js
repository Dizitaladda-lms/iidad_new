import { NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/request-info";

const CRM_PUBLIC_URL = "https://leads.dizitaladda.com/api/public/leads";
const DEFAULT_DOMAIN = "IIDAD";
const DEFAULT_SOURCE = "WEBSITE";

const SUBMIT_WINDOW_MS = 60_000; // 1 minute
const SUBMIT_LIMIT = 5; // max 5 submissions per minute per IP

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request) {
  try {
    const ip = await getClientIp(request);
    const isAllowed = rateLimit({
      key: `lead-submit:${ip}`,
      limit: SUBMIT_LIMIT,
      windowMs: SUBMIT_WINDOW_MS,
    });

    if (!isAllowed) {
      return NextResponse.json(
        { error: "Too many submissions. Please wait a minute before trying again." },
        { status: 429 }
      );
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON request body" }, { status: 400 });
    }

    const {
      name,
      email,
      phone,
      interest,
      courses,
      courseTitle,
      message,
      goal,
      notes,
      source: formSource,
    } = body || {};

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json({ error: "Please enter a valid name" }, { status: 400 });
    }

    if (!phone || typeof phone !== "string") {
      return NextResponse.json({ error: "Please enter a valid phone number" }, { status: 400 });
    }

    // Extract clean 10-digit mobile number for CRM
    const cleanMobile = String(phone).replace(/\D/g, "").slice(-10);
    if (cleanMobile.length < 10) {
      return NextResponse.json({ error: "Please enter a valid 10-digit mobile number" }, { status: 400 });
    }

    if (!email || typeof email !== "string" || !EMAIL_REGEX.test(email.trim())) {
      return NextResponse.json({ error: "Please enter a valid email address" }, { status: 400 });
    }

    const interestedCourse = interest || courses || courseTitle || "Full Stack Web Development";
    const remarksList = [formSource ? `Form: ${formSource}` : null, message, goal, notes].filter(Boolean);
    const combinedRemarks = remarksList.length > 0 ? remarksList.join(" | ") : null;

    // Payload formatted specifically for DizitalAdda CRM Public API
    const crmPayload = {
      full_name: name.trim(),
      mobile: cleanMobile,
      email: email.trim().toLowerCase(),
      domain: process.env.CRM_DOMAIN || DEFAULT_DOMAIN,
      source: process.env.CRM_SOURCE || DEFAULT_SOURCE,
      interested_course: interestedCourse,
      remarks: combinedRemarks,
    };

    const targetUrl = process.env.CRM_PUBLIC_API_URL || CRM_PUBLIC_URL;

    let crmSuccess = false;
    let crmResponseData = null;

    try {
      const crmRes = await fetch(targetUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(crmPayload),
      });

      const text = await crmRes.text().catch(() => "");
      try {
        crmResponseData = JSON.parse(text);
      } catch {
        crmResponseData = { raw: text };
      }

      if (crmRes.ok && (crmResponseData?.success || crmRes.status === 201 || crmRes.status === 200)) {
        crmSuccess = true;
      } else {
        console.warn("CRM public lead warning:", crmRes.status, text);
      }
    } catch (crmErr) {
      console.error("CRM public lead network error:", crmErr.message);
    }

    // Optional secondary backup: Google Apps Script (if configured)
    if (process.env.GOOGLE_SCRIPT_URL) {
      try {
        await fetch(process.env.GOOGLE_SCRIPT_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...body,
            domain: process.env.CRM_DOMAIN || DEFAULT_DOMAIN,
            source: process.env.CRM_SOURCE || DEFAULT_SOURCE,
            phone: cleanMobile,
          }),
          redirect: "follow",
        }).catch(() => null);
      } catch (scriptErr) {
        console.warn("Secondary Google Script backup error:", scriptErr.message);
      }
    }

    if (crmSuccess) {
      return NextResponse.json(
        { success: true, message: "Lead captured successfully", data: crmResponseData?.data },
        { status: 200 }
      );
    }

    // Return success to the end user so submission UX remains smooth
    return NextResponse.json(
      { success: true, message: "Inquiry received" },
      { status: 200 }
    );
  } catch (error) {
    console.error("submit-demo failed:", error);
    return NextResponse.json({ error: "Unable to process submission at this time" }, { status: 500 });
  }
}
