"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Imourig global error]", error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif", background: "#fafaf9" }}>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
            flexDirection: "column",
            gap: "1rem",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "3rem" }}>🇲🇦</div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 900, color: "#1c1917" }}>
            Imourig is temporarily unavailable
          </h1>
          <p style={{ color: "#78716c", maxWidth: "400px" }}>
            We encountered a critical error. Please try refreshing the page. If
            the problem persists, contact{" "}
            <a href="mailto:hello@imourig.com" style={{ color: "#f59e0b" }}>
              hello@imourig.com
            </a>
            .
          </p>
          {error.digest && (
            <p style={{ fontSize: "0.75rem", color: "#a8a29e", fontFamily: "monospace" }}>
              Error ID: {error.digest}
            </p>
          )}
          <button
            onClick={reset}
            style={{
              background: "#f59e0b",
              color: "white",
              border: "none",
              padding: "0.75rem 1.5rem",
              borderRadius: "0.75rem",
              fontWeight: 700,
              cursor: "pointer",
              fontSize: "1rem",
            }}
          >
            Reload page
          </button>
        </div>
      </body>
    </html>
  );
}
