// pages/admin.js
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import api from "../utils/api";
import { isAuthenticated, isAdmin } from "../utils/auth";

export default function Admin() {
  const [biodataList, setBiodataList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);
  const [searchFilters, setSearchFilters] = useState({
    nama: "",
    posisi: "",
    pendidikan: "",
  });
  const [selectedBiodata, setSelectedBiodata] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated() || !isAdmin()) {
      router.push("/login");
      return;
    }
    fetchBiodataList();
  }, [router, currentPage]);

  // Modifikasi fetchBiodataList untuk menerima filter optional
  const fetchBiodataList = async (customFilters = null, customPage = null) => {
    setLoading(true);
    try {
      const filtersToUse = customFilters || searchFilters;
      const pageToUse = customPage || currentPage;

      const queryParams = new URLSearchParams({
        page: pageToUse,
        limit: limit,
      });

      // Add specific filter parameters
      if (filtersToUse.nama?.trim()) {
        queryParams.append("nama", filtersToUse.nama.trim());
      }
      if (filtersToUse.posisi?.trim()) {
        queryParams.append("posisi", filtersToUse.posisi.trim());
      }
      if (filtersToUse.pendidikan) {
        queryParams.append("pendidikan", filtersToUse.pendidikan);
      }

      const response = await api.get(`/biodata/all?${queryParams.toString()}`);
      setBiodataList(response.data.data.biodata || []);

      const pagination = response.data.data.pagination;
      setTotalPages(pagination?.pages || 1);
    } catch (err) {
      setError("Failed to fetch biodata list");
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fungsi reset filter yang sudah diperbaiki
  const handleResetFilters = () => {
    const resetFilters = {
      nama: "",
      posisi: "",
      pendidikan: "",
    };

    setSearchFilters(resetFilters);
    setCurrentPage(1);

    // Panggil fetchBiodataList dengan filter kosong langsung
    fetchBiodataList(resetFilters, 1);
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchBiodataList();
  };

  const handleViewDetails = async (id) => {
    try {
      const response = await api.get(`/biodata/${id}`);
      setSelectedBiodata(response.data.data);
      setShowModal(true);
    } catch (err) {
      setError("Failed to fetch biodata details");
    }
  };

  const handleDeleteBiodata = async (id) => {
    if (!confirm("Are you sure you want to delete this biodata?")) return;

    try {
      await api.delete(`/biodata/${id}`);
      setSuccess("Biodata deleted successfully");
      fetchBiodataList();
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to delete biodata");
      setTimeout(() => setError(""), 3000);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount);
  };

  const getHighestEducation = (pendidikan) => {
    if (!pendidikan || pendidikan.length === 0) return "N/A";
    const educationLevels = ["SMA", "SMK", "D3", "S1", "S2", "S3"];
    const highest = pendidikan.reduce((max, current) => {
      const maxIndex = educationLevels.indexOf(max.jenjang);
      const currentIndex = educationLevels.indexOf(current.jenjang);
      return currentIndex > maxIndex ? current : max;
    });
    return `${highest.jenjang} - ${highest.jurusan}`;
  };

  return (
    <div
      className="container-fluid py-4"
      style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}
    >
      {/* Header Section */}
      <div className="row mb-4">
        <div className="col-12">
          <div
            className="card border-0 shadow-sm"
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            }}
          >
            <div className="card-body text-white">
              <div className="d-flex align-items-center">
                <div className="me-3">
                  <div className="bg-white bg-opacity-20 rounded-circle p-3">
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 4a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h2 className="mb-1 fw-bold text-white">Admin Panel</h2>
                  <p className="mb-0 text-white opacity-75">
                    Employee Biodata Management System
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alert Messages */}
      {error && (
        <div className="row mb-4">
          <div className="col-12">
            <div
              className="alert alert-danger alert-dismissible fade show border-0 shadow-sm"
              role="alert"
            >
              <span style={{ marginRight: "8px" }}>⚠️</span>
              {error}
              <button
                type="button"
                className="btn-close"
                onClick={() => setError("")}
              ></button>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="row mb-4">
          <div className="col-12">
            <div
              className="alert alert-success alert-dismissible fade show border-0 shadow-sm"
              role="alert"
            >
              <span style={{ marginRight: "8px" }}>✅</span>
              {success}
              <button
                type="button"
                className="btn-close"
                onClick={() => setSuccess("")}
              ></button>
            </div>
          </div>
        </div>
      )}

      {/* Search Filters */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0 py-3">
              <div className="d-flex align-items-center">
                <span style={{ marginRight: "8px", fontSize: "18px" }}>🔍</span>
                <h5 className="mb-0 fw-semibold">Search & Filters</h5>
              </div>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-lg-4 col-md-6">
                  <div className="form-floating">
                    <input
                      type="text"
                      className="form-control"
                      id="nameSearch"
                      placeholder="Enter name..."
                      value={searchFilters.nama}
                      onChange={(e) =>
                        setSearchFilters({
                          ...searchFilters,
                          nama: e.target.value,
                        })
                      }
                    />
                    <label htmlFor="nameSearch">
                      <span style={{ marginRight: "4px" }}>👤</span>Search by
                      Name
                    </label>
                  </div>
                </div>
                <div className="col-lg-4 col-md-6">
                  <div className="form-floating">
                    <input
                      type="text"
                      className="form-control"
                      id="positionSearch"
                      placeholder="Enter position..."
                      value={searchFilters.posisi}
                      onChange={(e) =>
                        setSearchFilters({
                          ...searchFilters,
                          posisi: e.target.value,
                        })
                      }
                    />
                    <label htmlFor="positionSearch">
                      <span style={{ marginRight: "4px" }}>💼</span>Search by
                      Position
                    </label>
                  </div>
                </div>
                <div className="col-lg-4 col-md-6">
                  <div className="form-floating">
                    <select
                      className="form-select"
                      id="educationFilter"
                      value={searchFilters.pendidikan}
                      onChange={(e) =>
                        setSearchFilters({
                          ...searchFilters,
                          pendidikan: e.target.value,
                        })
                      }
                    >
                      <option value="">All Education Levels</option>
                      <option value="SMA">SMA</option>
                      <option value="SMK">SMK</option>
                      <option value="D3">D3</option>
                      <option value="S1">S1</option>
                      <option value="S2">S2</option>
                      <option value="S3">S3</option>
                    </select>
                    <label htmlFor="educationFilter">
                      <span style={{ marginRight: "4px" }}>🎓</span>Education
                      Level
                    </label>
                  </div>
                </div>
              </div>
              <div className="d-flex gap-2 mt-3">
                <button className="btn btn-primary px-4" onClick={handleSearch}>
                  <span style={{ marginRight: "8px" }}>🔍</span>Search
                </button>
                <button
                  className="btn btn-outline-secondary px-4"
                  onClick={handleResetFilters}
                >
                  <span style={{ marginRight: "8px" }}>🔄</span>Reset Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Biodata Table */}
      <div className="row">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0 py-3">
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  <span style={{ marginRight: "8px", fontSize: "18px" }}>
                    📊
                  </span>
                  <h5 className="mb-0 fw-semibold">Employee Biodata List</h5>
                </div>
                <span className="badge bg-primary rounded-pill">
                  {biodataList.length} Records
                </span>
              </div>
            </div>
            <div className="card-body p-0">
              {loading ? (
                <div className="text-center py-5">
                  <div
                    className="spinner-border text-primary"
                    role="status"
                    style={{ width: "3rem", height: "3rem" }}
                  >
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-3 text-muted">Loading biodata...</p>
                </div>
              ) : (
                <>
                  <div className="table-responsive">
                    <table className="table table-hover mb-0">
                      <thead className="table-light">
                        <tr>
                          <th className="px-4 py-3 fw-semibold">
                            <span style={{ marginRight: "8px" }}>#️⃣</span>ID
                          </th>
                          <th className="px-4 py-3 fw-semibold">
                            <span style={{ marginRight: "8px" }}>👤</span>Name
                          </th>
                          <th className="px-4 py-3 fw-semibold">
                            <span style={{ marginRight: "8px" }}>📧</span>Email
                          </th>
                          <th className="px-4 py-3 fw-semibold">
                            <span style={{ marginRight: "8px" }}>📍</span>Birth
                            Info
                          </th>
                          <th className="px-4 py-3 fw-semibold">
                            <span style={{ marginRight: "8px" }}>💼</span>
                            Position
                          </th>
                          <th className="px-4 py-3 fw-semibold">
                            <span style={{ marginRight: "8px" }}>📅</span>
                            Submitted
                          </th>
                          <th className="px-4 py-3 fw-semibold text-center">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {biodataList.length === 0 ? (
                          <tr>
                            <td colSpan="7" className="text-center py-5">
                              <div className="text-muted">
                                <div
                                  style={{
                                    fontSize: "48px",
                                    marginBottom: "16px",
                                    opacity: 0.5,
                                  }}
                                >
                                  📁
                                </div>
                                <p className="mb-0">No biodata found</p>
                                <small>Try adjusting your search filters</small>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          biodataList.map((biodata, index) => (
                            <tr key={biodata.id} className="align-middle">
                              <td className="px-4 py-3">
                                <span className="badge bg-light text-dark rounded-pill">
                                  {biodata.id}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <div className="d-flex align-items-center">
                                  <div
                                    className="avatar-initial bg-primary text-white rounded-circle me-3 d-flex align-items-center justify-content-center"
                                    style={{ width: "40px", height: "40px" }}
                                  >
                                    {biodata.namaLengkap
                                      .charAt(0)
                                      .toUpperCase()}
                                  </div>
                                  <div>
                                    <div className="fw-semibold text-dark">
                                      {biodata.namaLengkap}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <span className="text-muted">
                                  {biodata.email}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <small className="text-muted">
                                  {biodata.tempatTanggalLahir}
                                </small>
                              </td>
                              <td className="px-4 py-3">
                                <span className="badge bg-info bg-opacity-10 text-info border border-info border-opacity-25 rounded-pill">
                                  {biodata.posisiDilamar}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <small className="text-muted">
                                  {new Date(
                                    biodata.createdAt
                                  ).toLocaleDateString("id-ID")}
                                </small>
                              </td>
                              <td className="px-4 py-3 text-center">
                                <div className="btn-group" role="group">
                                  <button
                                    className="btn btn-sm btn-outline-primary"
                                    onClick={() =>
                                      handleViewDetails(biodata.id)
                                    }
                                    title="View Details"
                                  >
                                    👁️
                                  </button>
                                  <button
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() =>
                                      handleDeleteBiodata(biodata.id)
                                    }
                                    title="Delete"
                                  >
                                    🗑️
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Enhanced Pagination */}
                  {totalPages > 1 && (
                    <div className="card-footer bg-white border-0 py-3">
                      <nav>
                        <ul className="pagination justify-content-center mb-0">
                          <li
                            className={`page-item ${
                              currentPage === 1 ? "disabled" : ""
                            }`}
                          >
                            <button
                              className="page-link border-0"
                              onClick={() => setCurrentPage(currentPage - 1)}
                              disabled={currentPage === 1}
                            >
                              ←
                            </button>
                          </li>
                          {Array.from(
                            { length: Math.min(totalPages, 5) },
                            (_, i) => {
                              let page;
                              if (totalPages <= 5) {
                                page = i + 1;
                              } else if (currentPage <= 3) {
                                page = i + 1;
                              } else if (currentPage >= totalPages - 2) {
                                page = totalPages - 4 + i;
                              } else {
                                page = currentPage - 2 + i;
                              }
                              return (
                                <li
                                  key={page}
                                  className={`page-item ${
                                    currentPage === page ? "active" : ""
                                  }`}
                                >
                                  <button
                                    className="page-link border-0"
                                    onClick={() => setCurrentPage(page)}
                                  >
                                    {page}
                                  </button>
                                </li>
                              );
                            }
                          )}
                          <li
                            className={`page-item ${
                              currentPage === totalPages ? "disabled" : ""
                            }`}
                          >
                            <button
                              className="page-link border-0"
                              onClick={() => setCurrentPage(currentPage + 1)}
                              disabled={currentPage === totalPages}
                            >
                              →
                            </button>
                          </li>
                        </ul>
                        <div className="text-center mt-2">
                          <small className="text-muted">
                            Page {currentPage} of {totalPages}
                          </small>
                        </div>
                      </nav>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Detail Modal */}
      {showModal && selectedBiodata && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
            overflowY: "auto",
            paddingTop: "20px",
            paddingBottom: "20px",
          }}
        >
          <div
            className="modal-dialog modal-xl"
            style={{ margin: "20px auto" }}
          >
            <div
              className="modal-content border-0 shadow"
              style={{ maxHeight: "90vh" }}
            >
              <div className="modal-header bg-primary text-white">
                <div className="d-flex align-items-center">
                  <div
                    className="avatar-initial bg-white text-primary rounded-circle me-3 d-flex align-items-center justify-content-center"
                    style={{ width: "40px", height: "40px" }}
                  >
                    {selectedBiodata.namaLengkap.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h5 className="modal-title mb-0 text-white">
                      Biodata Details
                    </h5>
                    <small className="text-white opacity-75">
                      {selectedBiodata.namaLengkap}
                    </small>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div
                className="modal-body p-4"
                style={{ maxHeight: "70vh", overflowY: "auto" }}
              >
                {/* Personal Information */}
                <div className="card border-0 bg-light mb-4">
                  <div className="card-header bg-transparent border-0 pb-0">
                    <h6 className="text-primary mb-0">
                      <span style={{ marginRight: "8px" }}>👤</span>Personal
                      Information
                    </h6>
                  </div>
                  <div className="card-body">
                    <div className="row g-3">
                      <div className="col-md-6">
                        <div className="info-item">
                          <label className="text-muted small">Full Name</label>
                          <p className="mb-2 fw-semibold">
                            {selectedBiodata.namaLengkap}
                          </p>
                        </div>
                        <div className="info-item">
                          <label className="text-muted small">
                            Place/Date of Birth
                          </label>
                          <p className="mb-2">
                            {selectedBiodata.tempatTanggalLahir ||
                              `${selectedBiodata.tempatLahir}, ${new Date(
                                selectedBiodata.tanggalLahir
                              ).toLocaleDateString("id-ID")}`}
                          </p>
                        </div>
                        <div className="info-item">
                          <label className="text-muted small">Gender</label>
                          <p className="mb-2">
                            {selectedBiodata.jenisKelamin || "N/A"}
                          </p>
                        </div>
                        <div className="info-item">
                          <label className="text-muted small">Religion</label>
                          <p className="mb-2">
                            {selectedBiodata.agama || "N/A"}
                          </p>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="info-item">
                          <label className="text-muted small">
                            Marital Status
                          </label>
                          <p className="mb-2">
                            {selectedBiodata.statusPernikahan || "N/A"}
                          </p>
                        </div>
                        <div className="info-item">
                          <label className="text-muted small">Phone</label>
                          <p className="mb-2">
                            {selectedBiodata.noTelepon || "N/A"}
                          </p>
                        </div>
                        <div className="info-item">
                          <label className="text-muted small">Email</label>
                          <p className="mb-2">
                            {selectedBiodata.email ||
                              selectedBiodata.user?.email}
                          </p>
                        </div>
                        <div className="info-item">
                          <label className="text-muted small">
                            Position Applied
                          </label>
                          <p className="mb-2">
                            <span className="badge bg-primary">
                              {selectedBiodata.posisiDilamar}
                            </span>
                          </p>
                        </div>
                        <div className="info-item">
                          <label className="text-muted small">
                            Expected Salary
                          </label>
                          <p className="mb-2 fw-semibold text-success">
                            {selectedBiodata.gajiDiharapkan
                              ? formatCurrency(selectedBiodata.gajiDiharapkan)
                              : "N/A"}
                          </p>
                        </div>
                        <div className="info-item">
                          <label className="text-muted small">
                            Willing to be placed outside the city
                          </label>
                          <p className="mb-2">
                            <span
                              className={`badge ${
                                selectedBiodata.bersediaDitempatkanLuarKota
                                  ? "bg-success"
                                  : "bg-danger"
                              }`}
                            >
                              {selectedBiodata.bersediaDitempatkanLuarKota
                                ? "✅ Yes"
                                : "❌ No"}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="row mt-3">
                      <div className="col-md-6">
                        <div className="info-item">
                          <label className="text-muted small">
                            KTP Address
                          </label>
                          <p className="mb-0">
                            {selectedBiodata.alamatKTP || "N/A"}
                          </p>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="info-item">
                          <label className="text-muted small">
                            Current Address
                          </label>
                          <p className="mb-0">
                            {selectedBiodata.alamatDomisili || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Skills */}
                <div className="card border-0 bg-light mb-4">
                  <div className="card-header bg-transparent border-0 pb-0">
                    <h6 className="text-primary mb-0">
                      <span style={{ marginRight: "8px" }}>🛠️</span>Skills
                    </h6>
                  </div>
                  <div className="card-body">
                    {selectedBiodata.skill?.length > 0 ? (
                      <div className="row g-3">
                        {selectedBiodata.skill.map((skill, index) => (
                          <div key={index} className="col-md-6 col-lg-4">
                            <div className="d-flex align-items-center p-3 bg-white rounded border-start border-warning border-4">
                              <div className="me-3">
                                <div
                                  className="bg-warning text-white rounded-circle d-flex align-items-center justify-content-center"
                                  style={{ width: "40px", height: "40px" }}
                                >
                                  🛠️
                                </div>
                              </div>
                              <div className="flex-grow-1">
                                <h6 className="mb-1">{skill.namaSkill}</h6>
                                <span
                                  className={`badge ${
                                    skill.level === "Expert"
                                      ? "bg-success"
                                      : skill.level === "Advanced"
                                      ? "bg-info"
                                      : skill.level === "Intermediate"
                                      ? "bg-warning"
                                      : "bg-secondary"
                                  }`}
                                >
                                  {skill.level}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted mb-0">
                        No skills data available
                      </p>
                    )}
                  </div>
                </div>

                {/* Emergency Contacts */}
                <div className="card border-0 bg-light mb-4">
                  <div className="card-header bg-transparent border-0 pb-0">
                    <h6 className="text-primary mb-0">
                      <span style={{ marginRight: "8px" }}>🚨</span>Emergency
                      Contacts
                    </h6>
                  </div>
                  <div className="card-body">
                    {selectedBiodata.orangTerdekatDapatDihubungi?.length > 0 ? (
                      selectedBiodata.orangTerdekatDapatDihubungi.map(
                        (contact, index) => (
                          <div
                            key={index}
                            className="d-flex align-items-start mb-3 p-3 bg-white rounded border-start border-danger border-4"
                          >
                            <div className="me-3">
                              <div
                                className="bg-danger text-white rounded-circle d-flex align-items-center justify-content-center"
                                style={{ width: "40px", height: "40px" }}
                              >
                                🚨
                              </div>
                            </div>
                            <div className="flex-grow-1">
                              <h6 className="mb-1">{contact.nama}</h6>
                              <p className="text-muted mb-1">
                                <strong>Relationship:</strong>{" "}
                                {contact.hubungan}
                              </p>
                              <p className="text-muted mb-1">
                                <strong>Phone:</strong> {contact.noTelepon}
                              </p>
                              <p className="text-muted mb-0">
                                <strong>Address:</strong> {contact.alamat}
                              </p>
                            </div>
                          </div>
                        )
                      )
                    ) : (
                      <p className="text-muted mb-0">
                        No emergency contacts available
                      </p>
                    )}
                  </div>
                </div>

                {/* Education */}
                <div className="card border-0 bg-light mb-4">
                  <div className="card-header bg-transparent border-0 pb-0">
                    <h6 className="text-primary mb-0">
                      <span style={{ marginRight: "8px" }}>🎓</span>Education
                    </h6>
                  </div>
                  <div className="card-body">
                    {selectedBiodata.pendidikanTerakhir?.length > 0 ? (
                      selectedBiodata.pendidikanTerakhir.map((edu, index) => (
                        <div
                          key={index}
                          className="d-flex align-items-center mb-3 p-3 bg-white rounded border-start border-primary border-4"
                        >
                          <div className="me-3">
                            <div
                              className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                              style={{ width: "40px", height: "40px" }}
                            >
                              🎓
                            </div>
                          </div>
                          <div className="flex-grow-1">
                            <h6 className="mb-1">
                              {edu.jenjang} - {edu.jurusan}
                            </h6>
                            <p className="text-muted mb-1">{edu.institusi}</p>
                            <small className="text-muted">
                              Graduated: {edu.tahunLulus} | GPA: {edu.ipk}
                            </small>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted mb-0">
                        No education data available
                      </p>
                    )}
                  </div>
                </div>

                {/* Training */}
                <div className="card border-0 bg-light mb-4">
                  <div className="card-header bg-transparent border-0 pb-0">
                    <h6 className="text-primary mb-0">
                      <span style={{ marginRight: "8px" }}>📜</span>Training
                      History
                    </h6>
                  </div>
                  <div className="card-body">
                    {selectedBiodata.riwayatPelatihan?.length > 0 ? (
                      selectedBiodata.riwayatPelatihan.map(
                        (training, index) => (
                          <div
                            key={index}
                            className="d-flex align-items-center mb-3 p-3 bg-white rounded border-start border-success border-4"
                          >
                            <div className="me-3">
                              <div
                                className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center"
                                style={{ width: "40px", height: "40px" }}
                              >
                                📜
                              </div>
                            </div>
                            <div className="flex-grow-1">
                              <h6 className="mb-1">{training.namaPelatihan}</h6>
                              <p className="text-muted mb-1">
                                {training.penyelenggara} ({training.tahun})
                              </p>
                              {training.sertifikat && (
                                <span className="badge bg-success">
                                  <span style={{ marginRight: "4px" }}>✅</span>
                                  Certified
                                </span>
                              )}
                            </div>
                          </div>
                        )
                      )
                    ) : (
                      <p className="text-muted mb-0">
                        No training history available
                      </p>
                    )}
                  </div>
                </div>

                {/* Work Experience */}
                <div className="card border-0 bg-light">
                  <div className="card-header bg-transparent border-0 pb-0">
                    <h6 className="text-primary mb-0">
                      <span style={{ marginRight: "8px" }}>💼</span>Work
                      Experience
                    </h6>
                  </div>
                  <div className="card-body">
                    {selectedBiodata.riwayatPekerjaan?.length > 0 ? (
                      selectedBiodata.riwayatPekerjaan.map((work, index) => (
                        <div
                          key={index}
                          className="d-flex align-items-start mb-4 p-3 bg-white rounded border-start border-info border-4"
                        >
                          <div className="me-3">
                            <div
                              className="bg-info text-white rounded-circle d-flex align-items-center justify-content-center"
                              style={{ width: "40px", height: "40px" }}
                            >
                              💼
                            </div>
                          </div>
                          <div className="flex-grow-1">
                            <h6 className="mb-1">{work.posisi}</h6>
                            <p className="text-muted mb-2">
                              {work.namaPerusahaan}
                            </p>
                            <div className="row g-2">
                              <div className="col-md-6">
                                <small className="text-muted">
                                  Period: {work.tahunMulai} -{" "}
                                  {work.tahunSelesai}
                                </small>
                              </div>
                              <div className="col-md-6">
                                <small className="text-success fw-semibold">
                                  Last Salary:{" "}
                                  {formatCurrency(work.gajiTerakhir)}
                                </small>
                              </div>
                            </div>
                            <small className="text-muted">
                              Reason for leaving: {work.alasanKeluar}
                            </small>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted mb-0">
                        No work experience available
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="modal-footer border-0 bg-light">
                <button
                  type="button"
                  className="btn btn-secondary px-4"
                  onClick={() => setShowModal(false)}
                >
                  <span style={{ marginRight: "8px" }}>✖️</span>Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
