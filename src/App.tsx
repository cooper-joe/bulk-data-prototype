import { useState, useCallback } from "react";
import { CssVariables } from "@dhis2/ui";
import { GridForm } from "./components/GridForm/GridForm";
import { PrototypeControls } from "./components/PrototypeControls/PrototypeControls";
import type { Column, CellError, RowError } from "./components/GridForm/types";
import styles from "./App.module.css";

// Example data structure
const COLUMNS: Column[] = [
  {
    id: "id",
    label: "Unique ID",
    type: "text",
    width: "100px",
    readOnly: true,
  },
  {
    id: "firstName",
    label: "First name",
    type: "text",
    width: "150px",
    readOnly: true,
  },
  {
    id: "lastName",
    label: "Last name",
    type: "text",
    width: "150px",
    readOnly: true,
  },
  {
    id: "location",
    label: "Where did the child receive these immunizations?",
    type: "text",
    width: "300px",
  },
  {
    id: "notes",
    label: "Notes",
    type: "text",
    width: "200px",
  },
  {
    id: "bcg",
    label: "BCG",
    type: "radio",
    options: ["Yes", "No"],
    width: "120px",
  },
  {
    id: "bopc0",
    label: "bOPC 0",
    type: "radio",
    options: ["Yes", "No"],
    width: "120px",
  },
];

const INITIAL_DATA = [
  {
    id: "12397",
    firstName: "Ayotunde",
    lastName: "Okeke",
    location: "",
    notes: "",
    bcg: "",
    bopc0: "",
    bopv1: "",
    ipv: "",
    pcv: "",
    measles: "",
    dptHepB: "",
  },
  {
    id: "19873",
    firstName: "Modou",
    lastName: "Otieno",
    location: "",
    notes: "",
    bcg: "",
    bopc0: "",
    bopv1: "",
    ipv: "",
    pcv: "",
    measles: "",
    dptHepB: "",
  },
  {
    id: "23987",
    firstName: "Nnamdi",
    lastName: "Temitope",
    location: "",
    notes: "",
    bcg: "",
    bopc0: "",
    bopv1: "",
    ipv: "",
    pcv: "",
    measles: "",
    dptHepB: "",
  },
  {
    id: "36281",
    firstName: "Haruna",
    lastName: "Idowu",
    location: "",
    notes: "",
    bcg: "",
    bopc0: "",
    bopv1: "",
    ipv: "",
    pcv: "",
    measles: "",
    dptHepB: "",
  },
  {
    id: "32897",
    firstName: "Oni",
    lastName: "Idowu",
    location: "",
    notes: "",
    bcg: "",
    bopc0: "",
    bopv1: "",
    ipv: "",
    pcv: "",
    measles: "",
    dptHepB: "",
  },
  {
    id: "29873",
    firstName: "Synabou",
    lastName: "Kamau",
    location: "",
    notes: "",
    bcg: "",
    bopc0: "",
    bopv1: "",
    ipv: "",
    pcv: "",
    measles: "",
    dptHepB: "",
  },
  {
    id: "41256",
    firstName: "Amina",
    lastName: "Diallo",
    location: "",
    notes: "",
    bcg: "",
    bopc0: "",
    bopv1: "",
    ipv: "",
    pcv: "",
    measles: "",
    dptHepB: "",
  },
  {
    id: "52341",
    firstName: "Kofi",
    lastName: "Mensah",
    location: "",
    notes: "",
    bcg: "",
    bopc0: "",
    bopv1: "",
    ipv: "",
    pcv: "",
    measles: "",
    dptHepB: "",
  },
  {
    id: "63452",
    firstName: "Fatou",
    lastName: "Ndiaye",
    location: "",
    notes: "",
    bcg: "",
    bopc0: "",
    bopv1: "",
    ipv: "",
    pcv: "",
    measles: "",
    dptHepB: "",
  },
  {
    id: "74563",
    firstName: "Kwame",
    lastName: "Asante",
    location: "",
    notes: "",
    bcg: "",
    bopc0: "",
    bopv1: "",
    ipv: "",
    pcv: "",
    measles: "",
    dptHepB: "",
  },
];

// Example cell errors for demonstration - remove in production
const EXAMPLE_CELL_ERRORS: Record<number, CellError[]> = {
  1: [{ columnId: "location", message: "This field is required" }],
  3: [
    { columnId: "notes", message: "Invalid characters detected" },
    { columnId: "bcg", message: "Please select a value" },
  ],
};

// Example row errors for demonstration - when we don't know which cell has the error
const EXAMPLE_ROW_ERRORS: Record<number, RowError> = {
  5: { message: "This row contains invalid data. Please review all fields." },
  8: { message: "Duplicate entry detected" },
};

// Sample filled data for prototype demonstration
const SAMPLE_FILLED_DATA = INITIAL_DATA.map((row, index) => ({
  ...row,
  location: [
    "Health Center A",
    "Mobile Clinic",
    "Hospital B",
    "Community Outreach",
    "District Hospital",
  ][index % 5],
  notes: [
    "Completed on schedule",
    "Follow-up needed",
    "Parent absent",
    "All vaccines given",
    "Rescheduled",
  ][index % 5],
  bcg: index % 3 === 0 ? "Yes" : index % 3 === 1 ? "No" : "",
  bopc0: index % 2 === 0 ? "Yes" : "No",
}));

function App() {
  const [data, setData] = useState(INITIAL_DATA);
  const [rowErrorsEnabled, setRowErrorsEnabled] = useState(false);
  const [cellErrorsEnabled, setCellErrorsEnabled] = useState(false);

  const handleToggleRowErrors = useCallback(() => {
    setRowErrorsEnabled((prev) => !prev);
  }, []);

  const handleToggleCellErrors = useCallback(() => {
    setCellErrorsEnabled((prev) => !prev);
  }, []);

  const handleFillData = useCallback(() => {
    setData(SAMPLE_FILLED_DATA);
  }, []);

  const handleClearData = useCallback(() => {
    setData(INITIAL_DATA);
  }, []);

  return (
    <>
      <CssVariables colors spacers />
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.header}>
            <h2>Form: Laboratory results</h2>
          </div>
          <GridForm
            columns={COLUMNS}
            data={data}
            onChange={setData}
            cellErrors={cellErrorsEnabled ? EXAMPLE_CELL_ERRORS : {}}
            rowErrors={rowErrorsEnabled ? EXAMPLE_ROW_ERRORS : {}}
          />
        </div>
        {/* <button className={styles.addButton} onClick={handleAddRow}>
          + Add row
        </button> */}
      </div>

      <PrototypeControls
        rowErrorsEnabled={rowErrorsEnabled}
        cellErrorsEnabled={cellErrorsEnabled}
        onToggleRowErrors={handleToggleRowErrors}
        onToggleCellErrors={handleToggleCellErrors}
        onFillData={handleFillData}
        onClearData={handleClearData}
      />
    </>
  );
}

export default App;
