// pages/biodata.js
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import api from "../utils/api";
import { isAuthenticated } from "../utils/auth";

export default function Biodata() {
  const [biodata, setBiodata] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const router = useRouter();

  const [formData, setFormData] = useState({
    namaLengkap: "",
    tempatLahir: "",
    tanggalLahir: "",
    jenisKelamin: "",
    agama: "",
    statusPernikahan: "",
    alamatKTP: "",
    alamatDomisili: "",
    noTelepon: "",
    email: "",
    posisiDilamar: "",
    gajiDiharapkan: "",
    bersediaDitempatkanLuarKota: false,
    pendidikanTerakhir: [
      {
        jenjang: "",
        institusi: "",
        jurusan: "",
        tahunLulus: "",
        ipk: "",
      },
    ],
    riwayatPelatihan: [
      {
        namaPelatihan: "",
        penyelenggara: "",
        tahun: "",
        sertifikat: true,
      },
    ],
    riwayatPekerjaan: [
      {
        namaPerusahaan: "",
        posisi: "",
        tahunMulai: "",
        tahunSelesai: "",
        gajiTerakhir: "",
        alasanKeluar: "",
      },
    ],
    orangTerdekatDapatDihubungi: [
      {
        nama: "",
        hubungan: "",
        noTelepon: "",
        alamat: "",
      },
    ],
    skill: [
      {
        namaSkill: "",
        level: "",
      },
    ],
  });

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }
    fetchBiodata();
  }, [router]);

  const fetchBiodata = async () => {
    try {
      const response = await api.get("/biodata/me");
      if (response.data.data) {
        setBiodata(response.data.data);
        setFormData(response.data.data);
      } else {
        setIsEditing(true);
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setIsEditing(true);
      } else {
        setError("Failed to fetch biodata");
      }
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "" });
    }, 3000);
  };

  const handleCancel = () => {
    if (biodata) {
      setFormData(biodata);
    } else {
      setFormData({
        namaLengkap: "",
        tempatLahir: "",
        tanggalLahir: "",
        jenisKelamin: "",
        agama: "",
        statusPernikahan: "",
        alamatKTP: "",
        alamatDomisili: "",
        noTelepon: "",
        email: "",
        posisiDilamar: "",
        gajiDiharapkan: "",
        bersediaDitempatkanLuarKota: false,
        pendidikanTerakhir: [
          {
            jenjang: "",
            institusi: "",
            jurusan: "",
            tahunLulus: "",
            ipk: "",
          },
        ],
        riwayatPelatihan: [
          {
            namaPelatihan: "",
            penyelenggara: "",
            tahun: "",
            sertifikat: true,
          },
        ],
        riwayatPekerjaan: [
          {
            namaPerusahaan: "",
            posisi: "",
            tahunMulai: "",
            tahunSelesai: "",
            gajiTerakhir: "",
            alasanKeluar: "",
          },
        ],
        orangTerdekatDapatDihubungi: [
          {
            nama: "",
            hubungan: "",
            noTelepon: "",
            alamat: "",
          },
        ],
        skill: [
          {
            namaSkill: "",
            level: "",
          },
        ],
      });
    }
    setFieldErrors({});
    setError("");
    setIsEditing(false);
  };

  const clearFieldError = (fieldPath) => {
    if (fieldErrors[fieldPath]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldPath];
        return newErrors;
      });
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    clearFieldError(name);
  };

  const handleArrayChange = (arrayName, index, field, value) => {
    const newArray = [...formData[arrayName]];
    newArray[index] = {
      ...newArray[index],
      [field]: value,
    };
    setFormData({
      ...formData,
      [arrayName]: newArray,
    });
    clearFieldError(`${arrayName}[${index}].${field}`);
  };

  const addArrayItem = (arrayName) => {
    const templates = {
      pendidikanTerakhir: {
        jenjang: "",
        institusi: "",
        jurusan: "",
        tahunLulus: "",
        ipk: "",
      },
      riwayatPelatihan: {
        namaPelatihan: "",
        penyelenggara: "",
        tahun: "",
        sertifikat: true,
      },
      riwayatPekerjaan: {
        namaPerusahaan: "",
        posisi: "",
        tahunMulai: "",
        tahunSelesai: "",
        gajiTerakhir: "",
        alasanKeluar: "",
      },
      orangTerdekatDapatDihubungi: {
        nama: "",
        hubungan: "",
        noTelepon: "",
        alamat: "",
      },
      skill: {
        namaSkill: "",
        level: "",
      },
    };

    setFormData({
      ...formData,
      [arrayName]: [...formData[arrayName], templates[arrayName]],
    });
  };

  const removeArrayItem = (arrayName, index) => {
    const newArray = formData[arrayName].filter((_, i) => i !== index);
    setFormData({
      ...formData,
      [arrayName]: newArray,
    });
  };

  const validateForm = () => {
    const errors = {};

    formData.pendidikanTerakhir.forEach((edu, index) => {
      const hasAnyEducationField =
        edu.jenjang ||
        edu.institusi ||
        edu.jurusan ||
        edu.tahunLulus ||
        edu.ipk;

      if (hasAnyEducationField) {
        if (!edu.jenjang)
          errors[`pendidikanTerakhir[${index}].jenjang`] =
            "Jenjang pendidikan harus diisi";
        if (!edu.institusi)
          errors[`pendidikanTerakhir[${index}].institusi`] =
            "Institusi harus diisi";
        if (!edu.jurusan)
          errors[`pendidikanTerakhir[${index}].jurusan`] =
            "Jurusan harus diisi";
        if (!edu.tahunLulus)
          errors[`pendidikanTerakhir[${index}].tahunLulus`] =
            "Tahun lulus harus diisi";
        if (!edu.ipk)
          errors[`pendidikanTerakhir[${index}].ipk`] = "IPK harus diisi";
      }
    });

    formData.riwayatPelatihan.forEach((training, index) => {
      const hasAnyTrainingField =
        training.namaPelatihan || training.penyelenggara || training.tahun;

      if (hasAnyTrainingField) {
        if (!training.namaPelatihan)
          errors[`riwayatPelatihan[${index}].namaPelatihan`] =
            "Nama pelatihan harus diisi";
        if (!training.penyelenggara)
          errors[`riwayatPelatihan[${index}].penyelenggara`] =
            "Penyelenggara harus diisi";
        if (!training.tahun)
          errors[`riwayatPelatihan[${index}].tahun`] =
            "Tahun pelatihan harus diisi";
      }
    });

    formData.riwayatPekerjaan.forEach((work, index) => {
      const hasAnyWorkField =
        work.namaPerusahaan ||
        work.posisi ||
        work.tahunMulai ||
        work.tahunSelesai ||
        work.gajiTerakhir ||
        work.alasanKeluar;

      if (hasAnyWorkField) {
        if (!work.namaPerusahaan)
          errors[`riwayatPekerjaan[${index}].namaPerusahaan`] =
            "Nama perusahaan harus diisi";
        if (!work.posisi)
          errors[`riwayatPekerjaan[${index}].posisi`] = "Posisi harus diisi";
        if (!work.tahunMulai)
          errors[`riwayatPekerjaan[${index}].tahunMulai`] =
            "Tahun mulai harus diisi";
        if (!work.tahunSelesai)
          errors[`riwayatPekerjaan[${index}].tahunSelesai`] =
            "Tahun selesai harus diisi";
        if (!work.gajiTerakhir)
          errors[`riwayatPekerjaan[${index}].gajiTerakhir`] =
            "Gaji terakhir harus diisi";
      }
    });

    formData.orangTerdekatDapatDihubungi.forEach((contact, index) => {
      const hasAnyContactField =
        contact.nama || contact.hubungan || contact.noTelepon || contact.alamat;

      if (hasAnyContactField) {
        if (!contact.nama)
          errors[`orangTerdekatDapatDihubungi[${index}].nama`] =
            "Nama harus diisi";
        if (!contact.hubungan)
          errors[`orangTerdekatDapatDihubungi[${index}].hubungan`] =
            "Hubungan harus diisi";
        if (!contact.noTelepon)
          errors[`orangTerdekatDapatDihubungi[${index}].noTelepon`] =
            "No. telepon harus diisi";
        if (!contact.alamat)
          errors[`orangTerdekatDapatDihubungi[${index}].alamat`] =
            "Alamat harus diisi";
      }
    });

    formData.skill.forEach((skill, index) => {
      const hasAnySkillField = skill.namaSkill || skill.level;

      if (hasAnySkillField) {
        if (!skill.namaSkill)
          errors[`skill[${index}].namaSkill`] = "Nama skill harus diisi";
        if (!skill.level)
          errors[`skill[${index}].level`] = "Level skill harus diisi";
      }
    });

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setFieldErrors({});

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      setError("Mohon lengkapi semua field yang diperlukan");
      setSaving(false);
      return;
    }

    try {
      const filteredData = {
        ...formData,
        pendidikanTerakhir: formData.pendidikanTerakhir.filter(
          (edu) =>
            edu.jenjang ||
            edu.institusi ||
            edu.jurusan ||
            edu.tahunLulus ||
            edu.ipk
        ),
        riwayatPelatihan: formData.riwayatPelatihan.filter(
          (training) =>
            training.namaPelatihan || training.penyelenggara || training.tahun
        ),
        riwayatPekerjaan: formData.riwayatPekerjaan.filter(
          (work) =>
            work.namaPerusahaan ||
            work.posisi ||
            work.tahunMulai ||
            work.tahunSelesai ||
            work.gajiTerakhir ||
            work.alasanKeluar
        ),
        orangTerdekatDapatDihubungi:
          formData.orangTerdekatDapatDihubungi.filter(
            (contact) =>
              contact.nama ||
              contact.hubungan ||
              contact.noTelepon ||
              contact.alamat
          ),
        skill: formData.skill.filter((skill) => skill.namaSkill || skill.level),
      };

      const response = await api.post("/biodata", filteredData);

      setBiodata(response.data.data);
      setIsEditing(false);
      showToast("Biodata berhasil disimpan!", "success");
      await fetchBiodata();
    } catch (err) {
      if (err.response?.data?.errors) {
        const backendErrors = {};
        err.response.data.errors.forEach((error) => {
          backendErrors[error.path] = error.msg;
        });
        setFieldErrors(backendErrors);
      }
      setError(err.response?.data?.message || "Failed to save biodata");
    } finally {
      setSaving(false);
    }
  };

  const getFieldError = (fieldPath) => {
    return fieldErrors[fieldPath];
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-6 text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2 text-muted">Loading biodata...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Toast Notification */}
      {toast.show && (
        <div
          className="toast show position-fixed top-0 end-0 m-3"
          style={{ zIndex: 9999 }}
          role="alert"
        >
          <div
            className={`toast-header bg-${
              toast.type === "success" ? "success" : "danger"
            } text-white`}
          >
            <strong className="me-auto">
              {toast.type === "success" ? "✓ Berhasil" : "✗ Error"}
            </strong>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={() => setToast({ show: false, message: "", type: "" })}
            ></button>
          </div>
          <div className="toast-body">{toast.message}</div>
        </div>
      )}

      {isEditing ? (
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h2 className="mb-1">
                  {biodata ? "Edit Biodata" : "Create Biodata"}
                </h2>
                <p className="text-muted mb-0">
                  {biodata
                    ? "Update your personal information"
                    : "Fill in your personal information"}
                </p>
              </div>
              {biodata && (
                <button
                  className="btn btn-outline-secondary"
                  onClick={handleCancel}
                >
                  <i className="bi bi-x-circle me-2"></i>Cancel
                </button>
              )}
            </div>

            {error && (
              <div
                className="alert alert-danger alert-dismissible"
                role="alert"
              >
                <i className="bi bi-exclamation-triangle me-2"></i>
                {error}
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setError("")}
                ></button>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Personal Information */}
              <div className="card shadow-sm mb-4">
                <div className="card-header bg-primary text-white">
                  <h5 className="card-title mb-0">
                    <i className="bi bi-person me-2"></i>Personal Information
                  </h5>
                </div>
                <div className="card-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Nama Lengkap *
                      </label>
                      <input
                        type="text"
                        className={`form-control ${
                          getFieldError("namaLengkap") ? "is-invalid" : ""
                        }`}
                        name="namaLengkap"
                        value={formData.namaLengkap}
                        onChange={handleChange}
                        placeholder="Masukkan nama lengkap"
                        required
                      />
                      {getFieldError("namaLengkap") && (
                        <div className="invalid-feedback">
                          {getFieldError("namaLengkap")}
                        </div>
                      )}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Tempat Lahir
                      </label>
                      <input
                        type="text"
                        className={`form-control ${
                          getFieldError("tempatLahir") ? "is-invalid" : ""
                        }`}
                        name="tempatLahir"
                        value={formData.tempatLahir}
                        onChange={handleChange}
                        placeholder="Masukkan tempat lahir"
                      />
                      {getFieldError("tempatLahir") && (
                        <div className="invalid-feedback">
                          {getFieldError("tempatLahir")}
                        </div>
                      )}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Tanggal Lahir
                      </label>
                      <input
                        type="date"
                        className={`form-control ${
                          getFieldError("tanggalLahir") ? "is-invalid" : ""
                        }`}
                        name="tanggalLahir"
                        value={formData.tanggalLahir}
                        onChange={handleChange}
                      />
                      {getFieldError("tanggalLahir") && (
                        <div className="invalid-feedback">
                          {getFieldError("tanggalLahir")}
                        </div>
                      )}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Jenis Kelamin
                      </label>
                      <select
                        className={`form-select ${
                          getFieldError("jenisKelamin") ? "is-invalid" : ""
                        }`}
                        name="jenisKelamin"
                        value={formData.jenisKelamin}
                        onChange={handleChange}
                      >
                        <option value="">Pilih jenis kelamin</option>
                        <option value="Laki-laki">Laki-laki</option>
                        <option value="Perempuan">Perempuan</option>
                      </select>
                      {getFieldError("jenisKelamin") && (
                        <div className="invalid-feedback">
                          {getFieldError("jenisKelamin")}
                        </div>
                      )}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Agama</label>
                      <select
                        className={`form-select ${
                          getFieldError("agama") ? "is-invalid" : ""
                        }`}
                        name="agama"
                        value={formData.agama}
                        onChange={handleChange}
                      >
                        <option value="">Pilih agama</option>
                        <option value="Islam">Islam</option>
                        <option value="Kristen">Kristen</option>
                        <option value="Katolik">Katolik</option>
                        <option value="Hindu">Hindu</option>
                        <option value="Buddha">Buddha</option>
                        <option value="Konghucu">Konghucu</option>
                      </select>
                      {getFieldError("agama") && (
                        <div className="invalid-feedback">
                          {getFieldError("agama")}
                        </div>
                      )}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Status Pernikahan
                      </label>
                      <select
                        className={`form-select ${
                          getFieldError("statusPernikahan") ? "is-invalid" : ""
                        }`}
                        name="statusPernikahan"
                        value={formData.statusPernikahan}
                        onChange={handleChange}
                      >
                        <option value="">Pilih status pernikahan</option>
                        <option value="Belum Menikah">Belum Menikah</option>
                        <option value="Menikah">Menikah</option>
                        <option value="Cerai">Cerai</option>
                      </select>
                      {getFieldError("statusPernikahan") && (
                        <div className="invalid-feedback">
                          {getFieldError("statusPernikahan")}
                        </div>
                      )}
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-semibold">
                        Alamat KTP
                      </label>
                      <textarea
                        className={`form-control ${
                          getFieldError("alamatKTP") ? "is-invalid" : ""
                        }`}
                        name="alamatKTP"
                        value={formData.alamatKTP}
                        onChange={handleChange}
                        rows="3"
                        placeholder="Masukkan alamat sesuai KTP"
                      ></textarea>
                      {getFieldError("alamatKTP") && (
                        <div className="invalid-feedback">
                          {getFieldError("alamatKTP")}
                        </div>
                      )}
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-semibold">
                        Alamat Domisili
                      </label>
                      <textarea
                        className={`form-control ${
                          getFieldError("alamatDomisili") ? "is-invalid" : ""
                        }`}
                        name="alamatDomisili"
                        value={formData.alamatDomisili}
                        onChange={handleChange}
                        rows="3"
                        placeholder="Masukkan alamat domisili saat ini"
                      ></textarea>
                      {getFieldError("alamatDomisili") && (
                        <div className="invalid-feedback">
                          {getFieldError("alamatDomisili")}
                        </div>
                      )}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        No. Telepon
                      </label>
                      <input
                        type="tel"
                        className={`form-control ${
                          getFieldError("noTelepon") ? "is-invalid" : ""
                        }`}
                        name="noTelepon"
                        value={formData.noTelepon}
                        onChange={handleChange}
                        placeholder="Contoh: 081234567890"
                      />
                      {getFieldError("noTelepon") && (
                        <div className="invalid-feedback">
                          {getFieldError("noTelepon")}
                        </div>
                      )}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Email</label>
                      <input
                        type="email"
                        className={`form-control ${
                          getFieldError("email") ? "is-invalid" : ""
                        }`}
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Contoh: nama@email.com"
                      />
                      {getFieldError("email") && (
                        <div className="invalid-feedback">
                          {getFieldError("email")}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Job Information */}
              <div className="card shadow-sm mb-4">
                <div className="card-header bg-success text-white">
                  <h5 className="card-title mb-0">
                    <i className="bi bi-briefcase me-2"></i>Job Information
                  </h5>
                </div>
                <div className="card-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Posisi Dilamar
                      </label>
                      <input
                        type="text"
                        className={`form-control ${
                          getFieldError("posisiDilamar") ? "is-invalid" : ""
                        }`}
                        name="posisiDilamar"
                        value={formData.posisiDilamar}
                        onChange={handleChange}
                        placeholder="Contoh: Software Developer"
                      />
                      {getFieldError("posisiDilamar") && (
                        <div className="invalid-feedback">
                          {getFieldError("posisiDilamar")}
                        </div>
                      )}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Gaji Diharapkan
                      </label>
                      <div className="input-group">
                        <span className="input-group-text">Rp</span>
                        <input
                          type="number"
                          className={`form-control ${
                            getFieldError("gajiDiharapkan") ? "is-invalid" : ""
                          }`}
                          name="gajiDiharapkan"
                          value={formData.gajiDiharapkan}
                          onChange={handleChange}
                          placeholder="5000000"
                        />
                        {getFieldError("gajiDiharapkan") && (
                          <div className="invalid-feedback">
                            {getFieldError("gajiDiharapkan")}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="bersediaDitempatkanLuarKota"
                          checked={formData.bersediaDitempatkanLuarKota}
                          onChange={handleChange}
                        />
                        <label className="form-check-label fw-semibold">
                          <i className="bi bi-geo-alt me-2"></i>
                          Bersedia ditempatkan di luar kota
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Education */}
              <div className="card shadow-sm mb-4">
                <div className="card-header bg-info text-white d-flex justify-content-between align-items-center">
                  <h5 className="card-title mb-0">
                    <i className="bi bi-mortarboard me-2"></i>Pendidikan
                    Terakhir
                  </h5>
                  <button
                    type="button"
                    className="btn btn-light btn-sm"
                    onClick={() => addArrayItem("pendidikanTerakhir")}
                  >
                    <i className="bi bi-plus me-1"></i>Add Education
                  </button>
                </div>
                <div className="card-body">
                  {formData.pendidikanTerakhir.map((edu, index) => (
                    <div
                      key={index}
                      className="border rounded p-3 mb-3 bg-light"
                    >
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="mb-0 text-primary">
                          <i className="bi bi-book me-2"></i>Education{" "}
                          {index + 1}
                        </h6>
                        {formData.pendidikanTerakhir.length > 1 && (
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() =>
                              removeArrayItem("pendidikanTerakhir", index)
                            }
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        )}
                      </div>

                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label fw-semibold">
                            Jenjang
                          </label>
                          <select
                            className={`form-select ${
                              getFieldError(
                                `pendidikanTerakhir[${index}].jenjang`
                              )
                                ? "is-invalid"
                                : ""
                            }`}
                            value={edu.jenjang}
                            onChange={(e) =>
                              handleArrayChange(
                                "pendidikanTerakhir",
                                index,
                                "jenjang",
                                e.target.value
                              )
                            }
                          >
                            <option value="">Pilih jenjang</option>
                            <option value="SMA">SMA</option>
                            <option value="D3">D3</option>
                            <option value="S1">S1</option>
                            <option value="S2">S2</option>
                            <option value="S3">S3</option>
                          </select>
                          {getFieldError(
                            `pendidikanTerakhir[${index}].jenjang`
                          ) && (
                            <div className="invalid-feedback">
                              {getFieldError(
                                `pendidikanTerakhir[${index}].jenjang`
                              )}
                            </div>
                          )}
                        </div>
                        <div className="col-md-6">
                          <label className="form-label fw-semibold">
                            Institusi
                          </label>
                          <input
                            type="text"
                            className={`form-control ${
                              getFieldError(
                                `pendidikanTerakhir[${index}].institusi`
                              )
                                ? "is-invalid"
                                : ""
                            }`}
                            value={edu.institusi}
                            onChange={(e) =>
                              handleArrayChange(
                                "pendidikanTerakhir",
                                index,
                                "institusi",
                                e.target.value
                              )
                            }
                            placeholder="Nama sekolah/universitas"
                          />
                          {getFieldError(
                            `pendidikanTerakhir[${index}].institusi`
                          ) && (
                            <div className="invalid-feedback">
                              {getFieldError(
                                `pendidikanTerakhir[${index}].institusi`
                              )}
                            </div>
                          )}
                        </div>
                        <div className="col-md-6">
                          <label className="form-label fw-semibold">
                            Jurusan
                          </label>
                          <input
                            type="text"
                            className={`form-control ${
                              getFieldError(
                                `pendidikanTerakhir[${index}].jurusan`
                              )
                                ? "is-invalid"
                                : ""
                            }`}
                            value={edu.jurusan}
                            onChange={(e) =>
                              handleArrayChange(
                                "pendidikanTerakhir",
                                index,
                                "jurusan",
                                e.target.value
                              )
                            }
                            placeholder="Nama jurusan"
                          />
                          {getFieldError(
                            `pendidikanTerakhir[${index}].jurusan`
                          ) && (
                            <div className="invalid-feedback">
                              {getFieldError(
                                `pendidikanTerakhir[${index}].jurusan`
                              )}
                            </div>
                          )}
                        </div>
                        <div className="col-md-3">
                          <label className="form-label fw-semibold">
                            Tahun Lulus
                          </label>
                          <input
                            type="number"
                            className={`form-control ${
                              getFieldError(
                                `pendidikanTerakhir[${index}].tahunLulus`
                              )
                                ? "is-invalid"
                                : ""
                            }`}
                            value={edu.tahunLulus}
                            onChange={(e) =>
                              handleArrayChange(
                                "pendidikanTerakhir",
                                index,
                                "tahunLulus",
                                e.target.value
                              )
                            }
                            placeholder="2023"
                          />
                          {getFieldError(
                            `pendidikanTerakhir[${index}].tahunLulus`
                          ) && (
                            <div className="invalid-feedback">
                              {getFieldError(
                                `pendidikanTerakhir[${index}].tahunLulus`
                              )}
                            </div>
                          )}
                        </div>
                        <div className="col-md-3">
                          <label className="form-label fw-semibold">
                            IPK/Nilai
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            className={`form-control ${
                              getFieldError(`pendidikanTerakhir[${index}].ipk`)
                                ? "is-invalid"
                                : ""
                            }`}
                            value={edu.ipk}
                            onChange={(e) =>
                              handleArrayChange(
                                "pendidikanTerakhir",
                                index,
                                "ipk",
                                e.target.value
                              )
                            }
                            placeholder="3.50"
                          />
                          {getFieldError(
                            `pendidikanTerakhir[${index}].ipk`
                          ) && (
                            <div className="invalid-feedback">
                              {getFieldError(
                                `pendidikanTerakhir[${index}].ipk`
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Training */}
              <div className="card shadow-sm mb-4">
                <div className="card-header bg-warning text-dark d-flex justify-content-between align-items-center">
                  <h5 className="card-title mb-0">
                    <i className="bi bi-award me-2"></i>Riwayat Pelatihan
                  </h5>
                  <button
                    type="button"
                    className="btn btn-dark btn-sm"
                    onClick={() => addArrayItem("riwayatPelatihan")}
                  >
                    <i className="bi bi-plus me-1"></i>Add Training
                  </button>
                </div>
                <div className="card-body">
                  {formData.riwayatPelatihan.map((training, index) => (
                    <div
                      key={index}
                      className="border rounded p-3 mb-3 bg-light"
                    >
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="mb-0 text-warning">
                          <i className="bi bi-certificate me-2"></i>Training{" "}
                          {index + 1}
                        </h6>
                        {formData.riwayatPelatihan.length > 1 && (
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() =>
                              removeArrayItem("riwayatPelatihan", index)
                            }
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        )}
                      </div>

                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label fw-semibold">
                            Nama Pelatihan
                          </label>
                          <input
                            type="text"
                            className={`form-control ${
                              getFieldError(
                                `riwayatPelatihan[${index}].namaPelatihan`
                              )
                                ? "is-invalid"
                                : ""
                            }`}
                            value={training.namaPelatihan}
                            onChange={(e) =>
                              handleArrayChange(
                                "riwayatPelatihan",
                                index,
                                "namaPelatihan",
                                e.target.value
                              )
                            }
                            placeholder="Nama pelatihan/kursus"
                          />
                          {getFieldError(
                            `riwayatPelatihan[${index}].namaPelatihan`
                          ) && (
                            <div className="invalid-feedback">
                              {getFieldError(
                                `riwayatPelatihan[${index}].namaPelatihan`
                              )}
                            </div>
                          )}
                        </div>
                        <div className="col-md-6">
                          <label className="form-label fw-semibold">
                            Penyelenggara
                          </label>
                          <input
                            type="text"
                            className={`form-control ${
                              getFieldError(
                                `riwayatPelatihan[${index}].penyelenggara`
                              )
                                ? "is-invalid"
                                : ""
                            }`}
                            value={training.penyelenggara}
                            onChange={(e) =>
                              handleArrayChange(
                                "riwayatPelatihan",
                                index,
                                "penyelenggara",
                                e.target.value
                              )
                            }
                            placeholder="Nama lembaga penyelenggara"
                          />
                          {getFieldError(
                            `riwayatPelatihan[${index}].penyelenggara`
                          ) && (
                            <div className="invalid-feedback">
                              {getFieldError(
                                `riwayatPelatihan[${index}].penyelenggara`
                              )}
                            </div>
                          )}
                        </div>
                        <div className="col-md-6">
                          <label className="form-label fw-semibold">
                            Tahun
                          </label>
                          <input
                            type="number"
                            className={`form-control ${
                              getFieldError(`riwayatPelatihan[${index}].tahun`)
                                ? "is-invalid"
                                : ""
                            }`}
                            value={training.tahun}
                            onChange={(e) =>
                              handleArrayChange(
                                "riwayatPelatihan",
                                index,
                                "tahun",
                                e.target.value
                              )
                            }
                            placeholder="2023"
                          />
                          {getFieldError(
                            `riwayatPelatihan[${index}].tahun`
                          ) && (
                            <div className="invalid-feedback">
                              {getFieldError(
                                `riwayatPelatihan[${index}].tahun`
                              )}
                            </div>
                          )}
                        </div>
                        <div className="col-md-6">
                          <div className="d-flex align-items-center mt-4">
                            <div className="form-check form-switch">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                checked={training.sertifikat}
                                onChange={(e) =>
                                  handleArrayChange(
                                    "riwayatPelatihan",
                                    index,
                                    "sertifikat",
                                    e.target.checked
                                  )
                                }
                              />
                              <label className="form-check-label fw-semibold">
                                <i className="bi bi-patch-check me-1"></i>Ada
                                Sertifikat
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Work Experience */}
              <div className="card shadow-sm mb-4">
                <div className="card-header bg-danger text-white d-flex justify-content-between align-items-center">
                  <h5 className="card-title mb-0">
                    <i className="bi bi-building me-2"></i>Riwayat Pekerjaan
                  </h5>
                  <button
                    type="button"
                    className="btn btn-light btn-sm"
                    onClick={() => addArrayItem("riwayatPekerjaan")}
                  >
                    <i className="bi bi-plus me-1"></i>Add Work Experience
                  </button>
                </div>
                <div className="card-body">
                  {formData.riwayatPekerjaan.map((work, index) => (
                    <div
                      key={index}
                      className="border rounded p-3 mb-3 bg-light"
                    >
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="mb-0 text-danger">
                          <i className="bi bi-briefcase me-2"></i>Work
                          Experience {index + 1}
                        </h6>
                        {formData.riwayatPekerjaan.length > 1 && (
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() =>
                              removeArrayItem("riwayatPekerjaan", index)
                            }
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        )}
                      </div>

                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label fw-semibold">
                            Nama Perusahaan
                          </label>
                          <input
                            type="text"
                            className={`form-control ${
                              getFieldError(
                                `riwayatPekerjaan[${index}].namaPerusahaan`
                              )
                                ? "is-invalid"
                                : ""
                            }`}
                            value={work.namaPerusahaan}
                            onChange={(e) =>
                              handleArrayChange(
                                "riwayatPekerjaan",
                                index,
                                "namaPerusahaan",
                                e.target.value
                              )
                            }
                            placeholder="Nama perusahaan"
                          />
                          {getFieldError(
                            `riwayatPekerjaan[${index}].namaPerusahaan`
                          ) && (
                            <div className="invalid-feedback">
                              {getFieldError(
                                `riwayatPekerjaan[${index}].namaPerusahaan`
                              )}
                            </div>
                          )}
                        </div>
                        <div className="col-md-6">
                          <label className="form-label fw-semibold">
                            Posisi
                          </label>
                          <input
                            type="text"
                            className={`form-control ${
                              getFieldError(`riwayatPekerjaan[${index}].posisi`)
                                ? "is-invalid"
                                : ""
                            }`}
                            value={work.posisi}
                            onChange={(e) =>
                              handleArrayChange(
                                "riwayatPekerjaan",
                                index,
                                "posisi",
                                e.target.value
                              )
                            }
                            placeholder="Jabatan/posisi"
                          />
                          {getFieldError(
                            `riwayatPekerjaan[${index}].posisi`
                          ) && (
                            <div className="invalid-feedback">
                              {getFieldError(
                                `riwayatPekerjaan[${index}].posisi`
                              )}
                            </div>
                          )}
                        </div>
                        <div className="col-md-6">
                          <label className="form-label fw-semibold">
                            Tahun Mulai
                          </label>
                          <input
                            type="number"
                            className={`form-control ${
                              getFieldError(
                                `riwayatPekerjaan[${index}].tahunMulai`
                              )
                                ? "is-invalid"
                                : ""
                            }`}
                            value={work.tahunMulai}
                            onChange={(e) =>
                              handleArrayChange(
                                "riwayatPekerjaan",
                                index,
                                "tahunMulai",
                                e.target.value
                              )
                            }
                            placeholder="2020"
                          />
                          {getFieldError(
                            `riwayatPekerjaan[${index}].tahunMulai`
                          ) && (
                            <div className="invalid-feedback">
                              {getFieldError(
                                `riwayatPekerjaan[${index}].tahunMulai`
                              )}
                            </div>
                          )}
                        </div>
                        <div className="col-md-6">
                          <label className="form-label fw-semibold">
                            Tahun Selesai
                          </label>
                          <input
                            type="number"
                            className={`form-control ${
                              getFieldError(
                                `riwayatPekerjaan[${index}].tahunSelesai`
                              )
                                ? "is-invalid"
                                : ""
                            }`}
                            value={work.tahunSelesai}
                            onChange={(e) =>
                              handleArrayChange(
                                "riwayatPekerjaan",
                                index,
                                "tahunSelesai",
                                e.target.value
                              )
                            }
                            placeholder="2023 atau kosongkan jika masih bekerja"
                          />
                          {getFieldError(
                            `riwayatPekerjaan[${index}].tahunSelesai`
                          ) && (
                            <div className="invalid-feedback">
                              {getFieldError(
                                `riwayatPekerjaan[${index}].tahunSelesai`
                              )}
                            </div>
                          )}
                        </div>
                        <div className="col-md-6">
                          <label className="form-label fw-semibold">
                            Gaji Terakhir
                          </label>
                          <div className="input-group">
                            <span className="input-group-text">Rp</span>
                            <input
                              type="number"
                              className={`form-control ${
                                getFieldError(
                                  `riwayatPekerjaan[${index}].gajiTerakhir`
                                )
                                  ? "is-invalid"
                                  : ""
                              }`}
                              value={work.gajiTerakhir}
                              onChange={(e) =>
                                handleArrayChange(
                                  "riwayatPekerjaan",
                                  index,
                                  "gajiTerakhir",
                                  e.target.value
                                )
                              }
                              placeholder="5000000"
                            />
                            {getFieldError(
                              `riwayatPekerjaan[${index}].gajiTerakhir`
                            ) && (
                              <div className="invalid-feedback">
                                {getFieldError(
                                  `riwayatPekerjaan[${index}].gajiTerakhir`
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="col-md-6">
                          <label className="form-label fw-semibold">
                            Alasan Keluar
                          </label>
                          <input
                            type="text"
                            className={`form-control ${
                              getFieldError(
                                `riwayatPekerjaan[${index}].alasanKeluar`
                              )
                                ? "is-invalid"
                                : ""
                            }`}
                            value={work.alasanKeluar}
                            onChange={(e) =>
                              handleArrayChange(
                                "riwayatPekerjaan",
                                index,
                                "alasanKeluar",
                                e.target.value
                              )
                            }
                            placeholder="Alasan berhenti bekerja"
                          />
                          {getFieldError(
                            `riwayatPekerjaan[${index}].alasanKeluar`
                          ) && (
                            <div className="invalid-feedback">
                              {getFieldError(
                                `riwayatPekerjaan[${index}].alasanKeluar`
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="card shadow-sm mb-4">
                <div className="card-header bg-secondary text-white d-flex justify-content-between align-items-center">
                  <h5 className="card-title mb-0">
                    <i className="bi bi-people me-2"></i>Orang Terdekat yang
                    Dapat Dihubungi
                  </h5>
                  <button
                    type="button"
                    className="btn btn-light btn-sm"
                    onClick={() => addArrayItem("orangTerdekatDapatDihubungi")}
                  >
                    <i className="bi bi-plus me-1"></i>Add Contact
                  </button>
                </div>
                <div className="card-body">
                  {formData.orangTerdekatDapatDihubungi.map(
                    (contact, index) => (
                      <div
                        key={index}
                        className="border rounded p-3 mb-3 bg-light"
                      >
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <h6 className="mb-0 text-secondary">
                            <i className="bi bi-person-lines-fill me-2"></i>
                            Emergency Contact {index + 1}
                          </h6>
                          {formData.orangTerdekatDapatDihubungi.length > 1 && (
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger"
                              onClick={() =>
                                removeArrayItem(
                                  "orangTerdekatDapatDihubungi",
                                  index
                                )
                              }
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          )}
                        </div>

                        <div className="row g-3">
                          <div className="col-md-6">
                            <label className="form-label fw-semibold">
                              Nama
                            </label>
                            <input
                              type="text"
                              className={`form-control ${
                                getFieldError(
                                  `orangTerdekatDapatDihubungi[${index}].nama`
                                )
                                  ? "is-invalid"
                                  : ""
                              }`}
                              value={contact.nama}
                              onChange={(e) =>
                                handleArrayChange(
                                  "orangTerdekatDapatDihubungi",
                                  index,
                                  "nama",
                                  e.target.value
                                )
                              }
                              placeholder="Nama lengkap"
                            />
                            {getFieldError(
                              `orangTerdekatDapatDihubungi[${index}].nama`
                            ) && (
                              <div className="invalid-feedback">
                                {getFieldError(
                                  `orangTerdekatDapatDihubungi[${index}].nama`
                                )}
                              </div>
                            )}
                          </div>
                          <div className="col-md-6">
                            <label className="form-label fw-semibold">
                              Hubungan
                            </label>
                            <select
                              className={`form-select ${
                                getFieldError(
                                  `orangTerdekatDapatDihubungi[${index}].hubungan`
                                )
                                  ? "is-invalid"
                                  : ""
                              }`}
                              value={contact.hubungan}
                              onChange={(e) =>
                                handleArrayChange(
                                  "orangTerdekatDapatDihubungi",
                                  index,
                                  "hubungan",
                                  e.target.value
                                )
                              }
                            >
                              <option value="">Pilih hubungan</option>
                              <option value="Ayah">Ayah</option>
                              <option value="Ibu">Ibu</option>
                              <option value="Suami">Suami</option>
                              <option value="Istri">Istri</option>
                              <option value="Anak">Anak</option>
                              <option value="Saudara">Saudara</option>
                              <option value="Teman">Teman</option>
                              <option value="Lainnya">Lainnya</option>
                            </select>
                            {getFieldError(
                              `orangTerdekatDapatDihubungi[${index}].hubungan`
                            ) && (
                              <div className="invalid-feedback">
                                {getFieldError(
                                  `orangTerdekatDapatDihubungi[${index}].hubungan`
                                )}
                              </div>
                            )}
                          </div>
                          <div className="col-md-6">
                            <label className="form-label fw-semibold">
                              No. Telepon
                            </label>
                            <input
                              type="tel"
                              className={`form-control ${
                                getFieldError(
                                  `orangTerdekatDapatDihubungi[${index}].noTelepon`
                                )
                                  ? "is-invalid"
                                  : ""
                              }`}
                              value={contact.noTelepon}
                              onChange={(e) =>
                                handleArrayChange(
                                  "orangTerdekatDapatDihubungi",
                                  index,
                                  "noTelepon",
                                  e.target.value
                                )
                              }
                              placeholder="081234567890"
                            />
                            {getFieldError(
                              `orangTerdekatDapatDihubungi[${index}].noTelepon`
                            ) && (
                              <div className="invalid-feedback">
                                {getFieldError(
                                  `orangTerdekatDapatDihubungi[${index}].noTelepon`
                                )}
                              </div>
                            )}
                          </div>
                          <div className="col-md-6">
                            <label className="form-label fw-semibold">
                              Alamat
                            </label>
                            <textarea
                              className={`form-control ${
                                getFieldError(
                                  `orangTerdekatDapatDihubungi[${index}].alamat`
                                )
                                  ? "is-invalid"
                                  : ""
                              }`}
                              value={contact.alamat}
                              onChange={(e) =>
                                handleArrayChange(
                                  "orangTerdekatDapatDihubungi",
                                  index,
                                  "alamat",
                                  e.target.value
                                )
                              }
                              rows="2"
                              placeholder="Alamat lengkap"
                            />
                            {getFieldError(
                              `orangTerdekatDapatDihubungi[${index}].alamat`
                            ) && (
                              <div className="invalid-feedback">
                                {getFieldError(
                                  `orangTerdekatDapatDihubungi[${index}].alamat`
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Skills */}
              <div className="card shadow-sm mb-4">
                <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
                  <h5 className="card-title mb-0">
                    <i className="bi bi-tools me-2"></i>Keahlian/Skills
                  </h5>
                  <button
                    type="button"
                    className="btn btn-light btn-sm"
                    onClick={() => addArrayItem("skill")}
                  >
                    <i className="bi bi-plus me-1"></i>Add Skill
                  </button>
                </div>
                <div className="card-body">
                  {formData.skill.map((skill, index) => (
                    <div
                      key={index}
                      className="border rounded p-3 mb-3 bg-light"
                    >
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="mb-0 text-dark">
                          <i className="bi bi-gear me-2"></i>Skill {index + 1}
                        </h6>
                        {formData.skill.length > 1 && (
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => removeArrayItem("skill", index)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        )}
                      </div>

                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label fw-semibold">
                            Nama Skill
                          </label>
                          <input
                            type="text"
                            className={`form-control ${
                              getFieldError(`skill[${index}].namaSkill`)
                                ? "is-invalid"
                                : ""
                            }`}
                            value={skill.namaSkill}
                            onChange={(e) =>
                              handleArrayChange(
                                "skill",
                                index,
                                "namaSkill",
                                e.target.value
                              )
                            }
                            placeholder="Contoh: JavaScript, Photoshop, Excel"
                          />
                          {getFieldError(`skill[${index}].namaSkill`) && (
                            <div className="invalid-feedback">
                              {getFieldError(`skill[${index}].namaSkill`)}
                            </div>
                          )}
                        </div>
                        <div className="col-md-6">
                          <label className="form-label fw-semibold">
                            Level
                          </label>
                          <select
                            className={`form-select ${
                              getFieldError(`skill[${index}].level`)
                                ? "is-invalid"
                                : ""
                            }`}
                            value={skill.level}
                            onChange={(e) =>
                              handleArrayChange(
                                "skill",
                                index,
                                "level",
                                e.target.value
                              )
                            }
                          >
                            <option value="">Pilih level</option>
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                            <option value="Expert">Expert</option>
                          </select>
                          {getFieldError(`skill[${index}].level`) && (
                            <div className="invalid-feedback">
                              {getFieldError(`skill[${index}].level`)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="d-grid gap-2 d-md-flex justify-content-md-center">
                <button
                  type="submit"
                  className="btn btn-primary btn-md px-4 "
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                      ></span>
                      Saving...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check-circle "></i>
                      Save Biodata
                    </>
                  )}
                </button>
                {biodata && (
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-md px-4"
                    onClick={handleCancel}
                  >
                    <i className="bi bi-x-circle "></i>Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      ) : (
        // Display mode
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h2 className="mb-1">My Biodata</h2>
                <p className="text-muted mb-0">
                  View your personal information
                </p>
              </div>
              <button
                className="btn btn-primary"
                onClick={() => setIsEditing(true)}
              >
                <i className="bi bi-pencil me-2"></i>Edit Biodata
              </button>
            </div>

            {/* Personal Information Display */}
            <div className="card shadow-sm mb-4">
              <div className="card-header bg-primary text-white">
                <h5 className="card-title mb-0">
                  <i className="bi bi-person me-2"></i>Personal Information
                </h5>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="info-item">
                      <label className="text-muted small">Nama Lengkap</label>
                      <p className="fw-semibold mb-2">
                        {biodata.namaLengkap || "-"}
                      </p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="info-item">
                      <label className="text-muted small">Tempat Lahir</label>
                      <p className="fw-semibold mb-2">
                        {biodata.tempatLahir || "-"}
                      </p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="info-item">
                      <label className="text-muted small">Tanggal Lahir</label>
                      <p className="fw-semibold mb-2">
                        {biodata.tanggalLahir || "-"}
                      </p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="info-item">
                      <label className="text-muted small">Jenis Kelamin</label>
                      <p className="fw-semibold mb-2">
                        {biodata.jenisKelamin || "-"}
                      </p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="info-item">
                      <label className="text-muted small">Agama</label>
                      <p className="fw-semibold mb-2">{biodata.agama || "-"}</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="info-item">
                      <label className="text-muted small">
                        Status Pernikahan
                      </label>
                      <p className="fw-semibold mb-2">
                        {biodata.statusPernikahan || "-"}
                      </p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="info-item">
                      <label className="text-muted small">No. Telepon</label>
                      <p className="fw-semibold mb-2">
                        {biodata.noTelepon || "-"}
                      </p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="info-item">
                      <label className="text-muted small">Email</label>
                      <p className="fw-semibold mb-2">{biodata.email || "-"}</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="info-item">
                      <label className="text-muted small">Posisi Dilamar</label>
                      <p className="fw-semibold mb-2">
                        {biodata.posisiDilamar || "-"}
                      </p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="info-item">
                      <label className="text-muted small">
                        Gaji Diharapkan
                      </label>
                      <p className="fw-semibold mb-2">
                        {biodata.gajiDiharapkan
                          ? `Rp ${Number(biodata.gajiDiharapkan).toLocaleString(
                              "id-ID"
                            )}`
                          : "-"}
                      </p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="info-item">
                      <label className="text-muted small">
                        Bersedia Ditempatkan Luar Kota
                      </label>
                      <p className="fw-semibold mb-2">
                        {biodata.bersediaDitempatkanLuarKota ? (
                          <span className="badge bg-success">
                            <i className="bi bi-check-circle me-1"></i>Ya
                          </span>
                        ) : (
                          <span className="badge bg-secondary">
                            <i className="bi bi-x-circle me-1"></i>Tidak
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="info-item">
                      <label className="text-muted small">Alamat KTP</label>
                      <p className="fw-semibold mb-2">
                        {biodata.alamatKTP || "-"}
                      </p>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="info-item">
                      <label className="text-muted small">
                        Alamat Domisili
                      </label>
                      <p className="fw-semibold mb-2">
                        {biodata.alamatDomisili || "-"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Education Display */}
            <div className="card shadow-sm mb-4">
              <div className="card-header bg-info text-white">
                <h5 className="card-title mb-0">
                  <i className="bi bi-mortarboard me-2"></i>Pendidikan Terakhir
                </h5>
              </div>
              <div className="card-body">
                {biodata.pendidikanTerakhir &&
                biodata.pendidikanTerakhir.length > 0 ? (
                  biodata.pendidikanTerakhir.map((edu, index) => (
                    <div
                      key={index}
                      className="border-start border-info border-4 ps-3 mb-4"
                    >
                      <h6 className="text-info mb-2">
                        <i className="bi bi-book me-2"></i>Education {index + 1}
                      </h6>
                      <div className="row g-2">
                        <div className="col-md-6">
                          <small className="text-muted">Jenjang:</small>
                          <p className="fw-semibold mb-1">
                            {edu.jenjang || "-"}
                          </p>
                        </div>
                        <div className="col-md-6">
                          <small className="text-muted">Institusi:</small>
                          <p className="fw-semibold mb-1">
                            {edu.institusi || "-"}
                          </p>
                        </div>
                        <div className="col-md-6">
                          <small className="text-muted">Jurusan:</small>
                          <p className="fw-semibold mb-1">
                            {edu.jurusan || "-"}
                          </p>
                        </div>
                        <div className="col-md-3">
                          <small className="text-muted">Tahun Lulus:</small>
                          <p className="fw-semibold mb-1">
                            {edu.tahunLulus || "-"}
                          </p>
                        </div>
                        <div className="col-md-3">
                          <small className="text-muted">IPK:</small>
                          <p className="fw-semibold mb-1">{edu.ipk || "-"}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted text-center py-3">
                    <i className="bi bi-info-circle me-2"></i>Belum ada data
                    pendidikan
                  </p>
                )}
              </div>
            </div>

            {/* Training Display */}
            <div className="card shadow-sm mb-4">
              <div className="card-header bg-warning text-dark">
                <h5 className="card-title mb-0">
                  <i className="bi bi-award me-2"></i>Riwayat Pelatihan
                </h5>
              </div>
              <div className="card-body">
                {biodata.riwayatPelatihan &&
                biodata.riwayatPelatihan.length > 0 ? (
                  biodata.riwayatPelatihan.map((training, index) => (
                    <div
                      key={index}
                      className="border-start border-warning border-4 ps-3 mb-4"
                    >
                      <h6 className="text-warning mb-2">
                        <i className="bi bi-certificate me-2"></i>Training{" "}
                        {index + 1}
                      </h6>
                      <div className="row g-2">
                        <div className="col-md-6">
                          <small className="text-muted">Nama Pelatihan:</small>
                          <p className="fw-semibold mb-1">
                            {training.namaPelatihan || "-"}
                          </p>
                        </div>
                        <div className="col-md-6">
                          <small className="text-muted">Penyelenggara:</small>
                          <p className="fw-semibold mb-1">
                            {training.penyelenggara || "-"}
                          </p>
                        </div>
                        <div className="col-md-6">
                          <small className="text-muted">Tahun:</small>
                          <p className="fw-semibold mb-1">
                            {training.tahun || "-"}
                          </p>
                        </div>
                        <div className="col-md-6">
                          <small className="text-muted">Sertifikat:</small>
                          <p className="fw-semibold mb-1">
                            {training.sertifikat ? (
                              <span className="badge bg-success">
                                <i className="bi bi-check-circle me-1"></i>Ya
                              </span>
                            ) : (
                              <span className="badge bg-secondary">
                                <i className="bi bi-x-circle me-1"></i>Tidak
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted text-center py-3">
                    <i className="bi bi-info-circle me-2"></i>Belum ada data
                    pelatihan
                  </p>
                )}
              </div>
            </div>

            {/* Work Experience Display */}
            <div className="card shadow-sm mb-4">
              <div className="card-header bg-danger text-white">
                <h5 className="card-title mb-0">
                  <i className="bi bi-building me-2"></i>Riwayat Pekerjaan
                </h5>
              </div>
              <div className="card-body">
                {biodata.riwayatPekerjaan &&
                biodata.riwayatPekerjaan.length > 0 ? (
                  biodata.riwayatPekerjaan.map((work, index) => (
                    <div
                      key={index}
                      className="border-start border-danger border-4 ps-3 mb-4"
                    >
                      <h6 className="text-danger mb-2">
                        <i className="bi bi-briefcase me-2"></i>Work Experience{" "}
                        {index + 1}
                      </h6>
                      <div className="row g-2">
                        <div className="col-md-6">
                          <small className="text-muted">Nama Perusahaan:</small>
                          <p className="fw-semibold mb-1">
                            {work.namaPerusahaan || "-"}
                          </p>
                        </div>
                        <div className="col-md-6">
                          <small className="text-muted">Posisi:</small>
                          <p className="fw-semibold mb-1">
                            {work.posisi || "-"}
                          </p>
                        </div>
                        <div className="col-md-6">
                          <small className="text-muted">Periode:</small>
                          <p className="fw-semibold mb-1">
                            {work.tahunMulai || "-"} -{" "}
                            {work.tahunSelesai || "Sekarang"}
                          </p>
                        </div>
                        <div className="col-md-6">
                          <small className="text-muted">Gaji Terakhir:</small>
                          <p className="fw-semibold mb-1">
                            {work.gajiTerakhir
                              ? `Rp ${Number(work.gajiTerakhir).toLocaleString(
                                  "id-ID"
                                )}`
                              : "-"}
                          </p>
                        </div>
                        <div className="col-12">
                          <small className="text-muted">Alasan Keluar:</small>
                          <p className="fw-semibold mb-1">
                            {work.alasanKeluar || "-"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted text-center py-3">
                    <i className="bi bi-info-circle me-2"></i>Belum ada data
                    pekerjaan
                  </p>
                )}
              </div>
            </div>

            {/* Emergency Contact Display */}
            <div className="card shadow-sm mb-4">
              <div className="card-header bg-secondary text-white">
                <h5 className="card-title mb-0">
                  <i className="bi bi-people me-2"></i>Orang Terdekat yang Dapat
                  Dihubungi
                </h5>
              </div>
              <div className="card-body">
                {biodata.orangTerdekatDapatDihubungi &&
                biodata.orangTerdekatDapatDihubungi.length > 0 ? (
                  biodata.orangTerdekatDapatDihubungi.map((contact, index) => (
                    <div
                      key={index}
                      className="border-start border-secondary border-4 ps-3 mb-4"
                    >
                      <h6 className="text-secondary mb-2">
                        <i className="bi bi-person-lines-fill me-2"></i>
                        Emergency Contact {index + 1}
                      </h6>
                      <div className="row g-2">
                        <div className="col-md-6">
                          <small className="text-muted">Nama:</small>
                          <p className="fw-semibold mb-1">
                            {contact.nama || "-"}
                          </p>
                        </div>
                        <div className="col-md-6">
                          <small className="text-muted">Hubungan:</small>
                          <p className="fw-semibold mb-1">
                            {contact.hubungan || "-"}
                          </p>
                        </div>
                        <div className="col-md-6">
                          <small className="text-muted">No. Telepon:</small>
                          <p className="fw-semibold mb-1">
                            {contact.noTelepon || "-"}
                          </p>
                        </div>
                        <div className="col-md-6">
                          <small className="text-muted">Alamat:</small>
                          <p className="fw-semibold mb-1">
                            {contact.alamat || "-"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted text-center py-3">
                    <i className="bi bi-info-circle me-2"></i>Belum ada data
                    kontak darurat
                  </p>
                )}
              </div>
            </div>

            {/* Skills Display */}
            <div className="card shadow-sm mb-4">
              <div className="card-header bg-dark text-white">
                <h5 className="card-title mb-0">
                  <i className="bi bi-tools me-2"></i>Keahlian/Skills
                </h5>
              </div>
              <div className="card-body">
                {biodata.skill && biodata.skill.length > 0 ? (
                  <div className="row g-3">
                    {biodata.skill.map((skill, index) => (
                      <div key={index} className="col-md-6">
                        <div className="border rounded p-3 bg-light">
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <h6 className="mb-1 text-dark">
                                <i className="bi bi-gear me-2"></i>
                                {skill.namaSkill || "-"}
                              </h6>
                              <span
                                className={`badge ${
                                  skill.level === "Expert"
                                    ? "bg-success"
                                    : skill.level === "Advanced"
                                    ? "bg-primary"
                                    : skill.level === "Intermediate"
                                    ? "bg-warning"
                                    : "bg-secondary"
                                }`}
                              >
                                {skill.level || "-"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted text-center py-3">
                    <i className="bi bi-info-circle me-2"></i>Belum ada data
                    keahlian
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
