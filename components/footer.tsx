"use client";

import { useEffect, useState } from "react";

export function Footer() {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  if (year === null) {
    return (
      <footer className="w-full border-t mt-auto py-8">
        <div className="w-full max-w-7xl mx-auto px-4 text-center text-sm text-muted-foreground">
          © 1on1 UK. MVP.
        </div>
      </footer>
    );
  }

  return (
    <footer className="w-full border-t mt-auto py-8">
      <div className="w-full max-w-7xl mx-auto px-4 text-center text-sm text-muted-foreground">
        © {year} 1on1 UK. MVP.
      </div>
    </footer>
  );
}

