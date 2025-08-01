// pages/register.js
import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import api from "../utils/api";

export default function Register() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Validasi password match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const { confirmPassword, ...submitData } = formData;
      await api.post("/auth/signup", submitData);
      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="min-vh-100 d-flex align-items-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5">
            <div className="card shadow-lg border-0 rounded-4">
              {/* Header dengan gradient */}
              <div
                className="card-header bg-gradient text-black text-center py-4 rounded-top-4"
                style={{
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                }}
              >
                <div className="mb-3">
                  <i className="fas fa-user-plus fa-3x opacity-75"></i>
                </div>
                <h3 className="mb-0 fw-bold">Create Account</h3>
                <p className="mb-0 opacity-75">Join us today and get started</p>
              </div>

              <div className="card-body p-4 p-md-5">
                {error && (
                  <div
                    className="alert alert-danger border-0 rounded-3 mb-4"
                    role="alert"
                  >
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    {error}
                  </div>
                )}

                {success && (
                  <div
                    className="alert alert-success border-0 rounded-3 mb-4"
                    role="alert"
                  >
                    <i className="fas fa-check-circle me-2"></i>
                    {success}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  {/* Email Field */}
                  <div className="mb-4">
                    <label
                      htmlFor="email"
                      className="form-label fw-semibold text-dark"
                    >
                      <i className="fas fa-envelope me-2 text-muted"></i>
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="form-control border-2 rounded-3"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      required
                      style={{
                        transition: "all 0.3s ease",
                        boxShadow: "none",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "#667eea")}
                      onBlur={(e) => (e.target.style.borderColor = "#dee2e6")}
                    />
                  </div>

                  {/* Password Field */}
                  <div className="mb-4">
                    <label
                      htmlFor="password"
                      className="form-label fw-semibold text-dark"
                    >
                      <i className="fas fa-lock me-2 text-muted"></i>
                      Password
                    </label>
                    <div className="position-relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="form-control border-2 rounded-3 pe-5"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Password"
                        required
                        minLength="6"
                        style={{
                          transition: "all 0.3s ease",
                          boxShadow: "none",
                        }}
                        onFocus={(e) =>
                          (e.target.style.borderColor = "#667eea")
                        }
                        onBlur={(e) => (e.target.style.borderColor = "#dee2e6")}
                      />
                      <button
                        type="button"
                        className="btn position-absolute top-50 end-0 translate-middle-y me-3 p-0 border-0 bg-transparent"
                        onClick={togglePasswordVisibility}
                        style={{ zIndex: 5 }}
                      >
                        <i
                          className={`fas ${
                            showPassword ? "fa-eye-slash" : "fa-eye"
                          } text-muted`}
                        ></i>
                      </button>
                    </div>
                    <small className="text-muted">
                      Password must be at least 6 characters long
                    </small>
                  </div>

                  {/* Confirm Password Field */}
                  <div className="mb-4">
                    <label
                      htmlFor="confirmPassword"
                      className="form-label fw-semibold text-dark"
                    >
                      <i className="fas fa-lock me-2 text-muted"></i>
                      Confirm Password
                    </label>
                    <div className="position-relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        className="form-control border-2 rounded-3 pe-5"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm password"
                        required
                        style={{
                          transition: "all 0.3s ease",
                          boxShadow: "none",
                        }}
                        onFocus={(e) =>
                          (e.target.style.borderColor = "#667eea")
                        }
                        onBlur={(e) => (e.target.style.borderColor = "#dee2e6")}
                      />
                      <button
                        type="button"
                        className="btn position-absolute top-50 end-0 translate-middle-y me-3 p-0 border-0 bg-transparent"
                        onClick={toggleConfirmPasswordVisibility}
                        style={{ zIndex: 5 }}
                      >
                        <i
                          className={`fas ${
                            showConfirmPassword ? "fa-eye-slash" : "fa-eye"
                          } text-muted`}
                        ></i>
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="btn w-100 text-white fw-semibold rounded-3 mb-4"
                    style={{
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      border: "none",
                      transition: "all 0.3s ease",
                      transform: loading ? "scale(0.98)" : "scale(1)",
                    }}
                    disabled={loading}
                    onMouseEnter={(e) =>
                      !loading &&
                      (e.target.style.transform = "translateY(-2px)")
                    }
                    onMouseLeave={(e) =>
                      !loading && (e.target.style.transform = "translateY(0)")
                    }
                  >
                    {loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Creating Account...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-user-plus me-2"></i>
                        Create Account
                      </>
                    )}
                  </button>
                </form>

                {/* Login Link */}
                <div className="text-center mb-4">
                  <p className="text-muted mb-0">
                    Already have an account?{" "}
                    <Link
                      href="/login"
                      className="text-decoration-none fw-semibold"
                      style={{ color: "#667eea" }}
                    >
                      Sign In
                    </Link>
                  </p>
                </div>

                {/* Divider */}
                <div className="position-relative mb-4">
                  <hr className="my-4" />
                  <span
                    className="position-absolute top-50 start-50 translate-middle bg-white px-3 text-muted small"
                    style={{ fontSize: "0.875rem" }}
                  >
                    Benefits
                  </span>
                </div>

                {/* Benefits Section */}
                <div className="bg-light rounded-3 p-3">
                  <div className="row g-2">
                    <div className="col-12">
                      <div className="d-flex align-items-center mb-2">
                        <div className="me-3">
                          <i className="fas fa-check-circle text-success"></i>
                        </div>
                        <small className="text-dark">
                          Free account creation
                        </small>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="d-flex align-items-center mb-2">
                        <div className="me-3">
                          <i className="fas fa-shield-alt text-primary"></i>
                        </div>
                        <small className="text-dark">
                          Secure data protection
                        </small>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="d-flex align-items-center">
                        <div className="me-3">
                          <i className="fas fa-bolt text-warning"></i>
                        </div>
                        <small className="text-dark">
                          Instant access to features
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center mt-4">
              <p className="text-muted small mb-0">
                <i className="fas fa-info-circle me-1"></i>
                By creating an account, you agree to our Terms of Service
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
