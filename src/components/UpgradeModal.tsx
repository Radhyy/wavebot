"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";

// Dynamically import Player to prevent SSR issues in Next.js
const Player = dynamic(
  () => import("@lottiefiles/react-lottie-player").then((mod) => mod.Player),
  { ssr: false }
);

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  featureName: string;
  minPlanName: string;
  minPlanPrice: string;
  currentPlan?: string;
  description?: string;
}

export default function UpgradeModal({
  isOpen,
  onClose,
  title,
  featureName,
  minPlanName,
  minPlanPrice,
  currentPlan = "Free Plan",
  description,
}: UpgradeModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(15, 23, 42, 0.65)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "1rem",
      }}
    >
      <div
        style={{
          background: "#ffffff",
          borderRadius: "1.25rem",
          maxWidth: "450px",
          width: "100%",
          padding: "2rem",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          position: "relative",
          textAlign: "center",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "1.25rem",
            right: "1.25rem",
            background: "#f1f5f9",
            border: "none",
            borderRadius: "50%",
            width: "32px",
            height: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "#64748b",
          }}
        >
          <X size={18} />
        </button>

        {/* Lottie Animation using standard JSON extracted from lock.lottie */}
        <div
          style={{
            width: "110px",
            height: "110px",
            margin: "0 auto 0.5rem auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {mounted ? (
            <Player
              autoplay
              loop
              src="/lock.json"
              style={{ width: "100%", height: "100%" }}
            />
          ) : (
            <div style={{ width: "100px", height: "100px" }} />
          )}
        </div>

        <span
          style={{
            display: "inline-block",
            backgroundColor: "#fee2e2",
            color: "#dc2626",
            fontSize: "0.75rem",
            fontWeight: 700,
            padding: "0.25rem 0.75rem",
            borderRadius: "9999px",
            marginBottom: "0.75rem",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          Akun Anda: {currentPlan}
        </span>

        <h3
          style={{
            fontSize: "1.35rem",
            fontWeight: 700,
            color: "#0f172a",
            marginBottom: "0.5rem",
          }}
        >
          {title}
        </h3>

        <p
          style={{
            color: "#64748b",
            fontSize: "0.92rem",
            lineHeight: 1.6,
            marginBottom: "1.75rem",
          }}
        >
          {description || (
            <>
              Fitur <strong>{featureName}</strong> tersedia mulai dari{" "}
              <strong>{minPlanName}</strong> ({minPlanPrice}). Silakan upgrade
              paket untuk membuka fitur ini dan memperbesar kuota Anda.
            </>
          )}
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <Link
            href="/pricing"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              padding: "0.85rem",
              backgroundColor: "#2563eb",
              color: "#ffffff",
              borderRadius: "0.75rem",
              fontWeight: 600,
              fontSize: "0.95rem",
              textDecoration: "none",
              boxShadow: "0 4px 12px rgba(37, 99, 235, 0.25)",
            }}
          >
            Lihat Pricelist & Beli Paket
          </Link>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: "#64748b",
              fontSize: "0.9rem",
              fontWeight: 500,
              cursor: "pointer",
              padding: "0.5rem",
            }}
          >
            Nanti Saja
          </button>
        </div>
      </div>
    </div>
  );
}
