// components/Layout.js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { removeAuth, isAuthenticated, isAdmin } from "../utils/auth";

export default function Layout({ children }) {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    removeAuth();
    router.push("/login");
  };

  if (!mounted) return null;

  const authenticated = isAuthenticated();
  const adminUser = isAdmin();

  return (
    <div>
      {/* Bootstrap CSS */}
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
        rel="stylesheet"
      />

      {/* Navigation */}
      {authenticated && (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
          <div className="container">
            <Link href="/" className="navbar-brand">
              Biodata Karyawan
            </Link>

            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav me-auto">
                <li className="nav-item">
                  <Link href="/biodata" className="nav-link">
                    My Biodata
                  </Link>
                </li>
                {adminUser && (
                  <li className="nav-item">
                    <Link href="/admin" className="nav-link">
                      Admin Panel
                    </Link>
                  </li>
                )}
              </ul>

              <ul className="navbar-nav">
                <li className="nav-item">
                  <button
                    className="btn btn-outline-light"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      )}

      {/* Main Content */}
      <main className="container mt-4">{children}</main>

      {/* Bootstrap JS */}
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    </div>
  );
}
