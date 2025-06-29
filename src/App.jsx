import { useState } from "react";
import "./App.css";
import axios from "axios";

export default function App() {
  const [serviceProvider, setServiceProvider] = useState("email");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleServiceChange = (e) => {
    setServiceProvider(e.target.value);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      const isXlsx =
        selectedFile.name.endsWith(".xlsx") ||
        selectedFile.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

      if (!isXlsx) {
        alert("Only .xlsx files are allowed.");
        e.target.value = "";
        setFile(null);
        return;
      }

      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please upload a valid .xlsx file.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("excel", file);

    const endpoint =
      serviceProvider === "email" ? "/email/send" : "/whatsapp/send";

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}${endpoint}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data);
      alert(`${serviceProvider.toUpperCase()} sent successfully.`);
    } catch (error) {
      console.error("API error:", error);
      const msg = error.response?.data?.error || "Unknown error occurred";
      alert(`Failed to send ${serviceProvider.toUpperCase()}: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App flex-col-center">
      <h1 className="heading">Bulk Sender</h1>
      <form className="flex-col-center form" onSubmit={handleSubmit}>
        <div className="flex-col-center serviceProvider">
          <p className="serviceProviderTitle">Select your service provider</p>
          <div className="flex-row-center radioWrapper">
            <label className="input email" htmlFor="email">
              <input
                type="radio"
                name="serviceProvider"
                id="email"
                value="email"
                checked={serviceProvider === "email"}
                onChange={handleServiceChange}
                style={{ marginRight: ".5vw" }}
              />
              Email
            </label>
            <label className="whatsapp" htmlFor="whatsapp">
              <input
                type="radio"
                name="serviceProvider"
                id="whatsapp"
                value="whatsapp"
                checked={serviceProvider === "whatsapp"}
                onChange={handleServiceChange}
                style={{ marginRight: ".5vw" }}
                disabled
              />
              WhatsApp
            </label>
          </div>
        </div>
        <input
          type="file"
          name="excel"
          className="inputFile"
          accept=".xlsx"
          onChange={handleFileChange}
        />
        <button type="submit" className="submitBtn" disabled={loading}>
          {loading ? <span className="loader"></span> : "SUBMIT"}
        </button>
      </form>
    </div>
  );
}
