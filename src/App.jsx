import React, { useState } from "react";
import axios from "axios";
import './App.css';

const TradingAPI = import.meta.env.VITE_API_KEY;

function App() {
  const [country, setCountry] = useState("Thailand");
  const [gdpData, setGdpData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_KEY = TradingAPI; // Replace with your Trading Economics API key

  const fetchData = async () => {
    setLoading(true);
    setError(""); // Reset any previous errors
    const endpoint = `https://api.tradingeconomics.com/historical/country/${country}/indicator/GDP?c=${API_KEY}`;
    
    try {
      const response = await axios.get(endpoint);
      const data = response.data;

      // Check if we have data and set it to state
      if (data && Array.isArray(data)) {
        setGdpData(data.reverse()); // Reverse to show latest data at the top
      } else {
        setGdpData([]); // No data available
      }
    } catch (error) {
      console.error("Error While fetching data: ", error);
      setError(`Failed to Fetch ${country}'s data. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-center p-5">
      <h1 className="text-[#007acc] text-4xl py-6 ">Trading Economics Data</h1>

      <div>
        <label htmlFor="country">Select Country: </label>
        <select
          id="country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        >
          <option value="Thailand">Thailand</option>
          <option value="Nigeria">Nigeria</option>
          <option value="Sweden">Sweden</option>
          <option value="Mexico">Mexico</option>
          <option value="New Zealand">New Zealand</option>
        </select>
        <button className="ml-2.5 px-2.5 py-1.25 text-white bg-blue-500 border-0 cursor-pointer hover:bg-blue-700" onClick={fetchData}>Fetch Data</button>
      </div>

      <div style={{ marginTop: "30px" }}>
        {loading && <p className="text-lg">Loading {country} data.....</p>}
        {error && <p className="text-red-600">{error}</p>}

        {gdpData.length > 0 ? (
          <table className="w-full max-w-[90%] mx-auto border border-[#ddd]  text-center">
            <thead>
              <tr>
                <th className="p-2.5 border border-[#000000] bg-red-200">Country</th>
                <th className="p-2.5 border border-[#000000] bg-red-200">Category</th>
                <th className="p-2.5 border border-[#000000] bg-red-200">Date</th>
                <th className="p-2.5 border border-[#000000] bg-red-200">GDP Value</th>
                <th className="p-2.5 border border-[#000000] bg-red-200">Frequency</th>
                <th className="p-2.5 border border-[#000000] bg-red-200">Historical Data Symbol</th>
                <th className="p-2.5 border border-[#000000] bg-red-200">Last Update</th>
              </tr>
            </thead>
            <tbody>
              {gdpData.map((item, index) => (
                <tr key={index}>
                  <td className="p-2.2 border border-[#000000] bg-blue-100">{item.Country}</td>
                  <td className="p-2.2 border border-[#000000] bg-blue-100">{item.Category}</td>
                  <td className="p-2.2 border border-[#000000] bg-blue-100">{item.DateTime}</td>
                  <td className="p-2.2 border border-[#000000] bg-blue-100">{item.Value}</td>
                  <td className="p-2.2 border border-[#000000] bg-blue-100">{item.Frequency}</td>
                  <td className="p-2.2 border border-[#000000] bg-blue-100">{item.HistoricalDataSymbol}</td>
                  <td className="p-2.2 border border-[#000000] bg-blue-100">{item.LastUpdate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-md">No Data Available. Please Fetch Data.</p>
        )}
      </div>
    </div>
  );
}

export default App;
