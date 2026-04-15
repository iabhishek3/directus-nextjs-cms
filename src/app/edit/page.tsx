"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import EditorShell from "@/components/EditorShell";

function EditContent() {
  const searchParams = useSearchParams();
  const template = searchParams.get("template") || "/templates/events";
  return <EditorShell initialTemplate={template} />;
}

export default function EditPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "#1a1a2e" }} />}>
      <EditContent />
    </Suspense>
  );
}
