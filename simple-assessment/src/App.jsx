import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import "./App.css";

// Reusable component to display data in a table format (referred ChatGPT)
const TableDisplay = ({ data, title }) => (
  <div>
    <h2>{title}</h2>
    <table>
      <thead>
        <tr>
          {Object.keys(data[0] || {}).map((key) => (
            <th key={key}>{key}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={index}>
            {Object.values(row).map((value, i) => (
              <td key={i}>{value}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const App = () => {
  // Hold the data from the CSV file
  const [tableData, setTableData] = useState([]);

  // Hold the calculated data for Table 2
  const [table2Data, setTable2Data] = useState([]);

  // State to handle errors
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the CSV file from the specified URL
        const response = await fetch("/Table_Input.csv");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Extract the text content from the response
        const csvText = await response.text();

        // Parse the CSV text using PapaParse (referred ChatGPT)
        Papa.parse(csvText, {
          header: true, // Use the first row as headers
          complete: (result) => {
            // Set the parsed data to tableData state
            setTableData(result.data);

            // Process the data to calculate values for Table 2
            processTable2(result.data);
          },
        });
      } catch (error) {
        console.error("Error loading CSV:", error);

        // Set an error message if the CSV file fails to load
        setError("Failed to load data. Please check the console for details.");
      }
    };

    // Call the fetchData function to load the CSV file
    fetchData();
  }, []);

  // Function to process data from the CSV file and calculate Table 2 values
  const processTable2 = (data) => {
    // Helper function to find the value of a specific index
    const findValue = (index) => {
      const row = data.find((row) => row["Index #"] === index);
      return row ? parseFloat(row["Value"]) : 0; // Return 0 if the index is not found
    };

    // Calculate the values for Table 2
    const alpha = findValue("A5") + findValue("A20"); // The total of A5 and A20
    const beta = findValue("A15") / (findValue("A7") || 1); // Dividing A15 by A7 (avoid division by zero)
    const charlie = findValue("A13") * findValue("A12"); // Multiplying A13 with A12

    // Store the calculated values in table2Data state
    setTable2Data([
      { Category: "Alpha", Value: alpha },
      { Category: "Beta", Value: beta },
      { Category: "Charlie", Value: charlie },
    ]);
  };

  return (
    <div>
      {/* Display an error message if the CSV file fails to load */}
      {error && <div className="error">{error}</div>}

      {/* Display the CSV file contents in Table 1 */}
      <TableDisplay data={tableData} title="Table 1" />

      {/* Display the calculated values in Table 2 */}
      <TableDisplay data={table2Data} title="Table 2" />
    </div>
  );
};

export default App;