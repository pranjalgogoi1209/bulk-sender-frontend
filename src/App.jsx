import { useState } from "react";
import "./App.css";

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

    setLoading(true); // Start loading

    const formData = new FormData();
    formData.append("file", file);

    const endpoint =
      serviceProvider === "email" ? "/api/send-email" : "/api/send-whatsapp";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert(`${serviceProvider.toUpperCase()} sent successfully.`);
      } else {
        const error = await response.text();
        alert(`Failed to send ${serviceProvider.toUpperCase()}: ${error}`);
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false); // Stop loading
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
