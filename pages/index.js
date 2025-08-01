// pages/index.js
import { useEffect } from "react";
import { useRouter } from "next/router";
import { isAuthenticated, isAdmin } from "../utils/auth";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
    } else if (isAdmin()) {
      router.push("/admin");
    } else {
      router.push("/biodata");
    }
  }, [router]);

  return (
    <div className="text-center">
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
}
