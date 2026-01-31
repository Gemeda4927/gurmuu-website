"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("❌ Permissions Page Error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">🔐</div>
        <h2 className="text-2xl font-bold mb-2">Permissions Error</h2>
        <p className="text-gray-600 mb-6">
          {error.message || "Something went wrong loading permissions"}
        </p>
        <div className="space-x-3">
          <Button onClick={() => reset()}>Try Again</Button>
          <Button variant="outline" onClick={() => window.location.href = "/superadmin"}>
            Go to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}