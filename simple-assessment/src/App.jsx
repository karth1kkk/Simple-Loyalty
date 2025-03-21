import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import "./App.css";

// reusable component to display data in a table format(referred chatgpt)
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
  // hold the data from the CSV file 
  const [tableData, setTableData] = useState([]);
  // hold the calculated data for Table 2
  const [table2Data, setTable2Data] = useState([]);

  useEffect(() => {
    // fetching the CSV file from the specified location(referred chatgpt as ive not used papaparse)
    fetch("/Table_Input.csv")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
      })
      .then((csvText) => {
        Papa.parse(csvText, {
          header: true, 
          complete: (result) => {
            setTableData(result.data);
            processTable2(result.data);
          },
        });
      })
      .catch((error) => {
        console.error("Error loading CSV:", error);
        alert("Failed to load data. Please check the console for details.");
      });
  }, []);

  // processing data from csv file and calculate table 2 values
  const processTable2 = (data) => {
    const findValue = (index) => {
      const row = data.find((row) => row["Index #"] === index);
      return row ? parseFloat(row["Value"]) : 0; 
    };

    // calculation for table 2
    const alpha = findValue("A5") + findValue("A20"); // the total of A5 and A20
    const beta = findValue("A15") / (findValue("A7") || 1); // dividing A15 by A7
    const charlie = findValue("A13") * findValue("A12"); // multiplying A13 with A12

    // calculated values stored
    setTable2Data([
      { Category: "Alpha", Value: alpha },
      { Category: "Beta", Value: beta },
      { Category: "Charlie", Value: charlie },
    ]);
  };

  return (
    <div>
      {/* displaying the CSV file contents */}
      <TableDisplay data={tableData} title="Table 1" />
      {/* displaying the calculated values based on the assessment table*/}
      <TableDisplay data={table2Data} title="Table 2" />
    </div>
  );
};

export default App;
