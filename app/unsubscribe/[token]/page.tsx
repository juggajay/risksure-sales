"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export default function UnsubscribePage() {
  const params = useParams();
  const token = params.token as string;

  const [status, setStatus] = useState<"loading" | "valid" | "invalid" | "done" | "already">("loading");
  const [reason, setReason] = useState("");

  useEffect(() => {
    async function verifyToken() {
      const result = await convex.query(api.unsubscribe.verifyToken, { token });

      if (!result.valid) {
        setStatus("invalid");
      } else if (result.alreadyUsed) {
        setStatus("already");
      } else {
        setStatus("valid");
      }
    }

    verifyToken();
  }, [token]);

  async function handleUnsubscribe() {
    const result = await convex.mutation(api.unsubscribe.processUnsubscribe, {
      token,
      reason: reason || undefined,
    });

    if (result.success) {
      setStatus("done");
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#f9fafb",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    }}>
      <div style={{
        maxWidth: 480,
        padding: 40,
        backgroundColor: "white",
        borderRadius: 8,
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        textAlign: "center",
      }}>
        {status === "loading" && (
          <p>Loading...</p>
        )}

        {status === "invalid" && (
          <>
            <h1 style={{ fontSize: 24, marginBottom: 16 }}>Invalid Link</h1>
            <p style={{ color: "#666" }}>
              This unsubscribe link is invalid or has expired.
            </p>
          </>
        )}

        {status === "already" && (
          <>
            <h1 style={{ fontSize: 24, marginBottom: 16 }}>Already Unsubscribed</h1>
            <p style={{ color: "#666" }}>
              You&apos;ve already been unsubscribed from our emails.
            </p>
          </>
        )}

        {status === "valid" && (
          <>
            <h1 style={{ fontSize: 24, marginBottom: 16 }}>Unsubscribe</h1>
            <p style={{ color: "#666", marginBottom: 24 }}>
              Are you sure you want to unsubscribe from RiskSure.AI emails?
            </p>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", marginBottom: 8, fontSize: 14, color: "#666" }}>
                Reason (optional):
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  fontSize: 14,
                  border: "1px solid #ddd",
                  borderRadius: 4,
                }}
              >
                <option value="">Select a reason...</option>
                <option value="too_many_emails">Too many emails</option>
                <option value="not_relevant">Not relevant to me</option>
                <option value="using_competitor">Using a competitor</option>
                <option value="no_longer_in_role">No longer in this role</option>
                <option value="other">Other</option>
              </select>
            </div>

            <button
              onClick={handleUnsubscribe}
              style={{
                width: "100%",
                padding: "12px 24px",
                fontSize: 16,
                backgroundColor: "#dc2626",
                color: "white",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
              }}
            >
              Unsubscribe
            </button>

            <p style={{ marginTop: 16, fontSize: 12, color: "#999" }}>
              You can also reply to any email with &quot;unsubscribe&quot; and we&apos;ll remove you.
            </p>
          </>
        )}

        {status === "done" && (
          <>
            <h1 style={{ fontSize: 24, marginBottom: 16 }}>Unsubscribed</h1>
            <p style={{ color: "#666" }}>
              You&apos;ve been successfully unsubscribed. You won&apos;t receive any more emails from us.
            </p>
            <p style={{ marginTop: 24, fontSize: 14, color: "#999" }}>
              Changed your mind?{" "}
              <a href="mailto:jayson@risksure.ai" style={{ color: "#2563eb" }}>
                Contact us
              </a>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
