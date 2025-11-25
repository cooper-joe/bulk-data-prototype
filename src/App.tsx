import { useState } from "react";
import { CssVariables } from "@dhis2/ui";
import { GridForm } from "./components/GridForm/GridForm";
import type { Column } from "./components/GridForm/types";
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
    bcg: "Yes",
    bopc0: "Yes",
    bopv1: "Yes",
    ipv: "Yes",
    pcv: "Yes",
    measles: "Yes",
    dptHepB: "Yes",
  },
  {
    id: "19873",
    firstName: "Modou",
    lastName: "Otieno",
    location: "",
    bcg: "Yes",
    bopc0: "Yes",
    bopv1: "Yes",
    ipv: "Yes",
    pcv: "Yes",
    measles: "Yes",
    dptHepB: "Yes",
  },
  {
    id: "23987",
    firstName: "Nnamdi",
    lastName: "Temitope",
    location: "",
    bcg: "Yes",
    bopc0: "Yes",
    bopv1: "Yes",
    ipv: "Yes",
    pcv: "Yes",
    measles: "Yes",
    dptHepB: "Yes",
  },
  {
    id: "36281",
    firstName: "Haruna",
    lastName: "Idowu",
    location: "",
    bcg: "Yes",
    bopc0: "Yes",
    bopv1: "Yes",
    ipv: "Yes",
    pcv: "Yes",
    measles: "Yes",
    dptHepB: "Yes",
  },
  {
    id: "32897",
    firstName: "Oni",
    lastName: "Idowu",
    location: "",
    bcg: "Yes",
    bopc0: "Yes",
    bopv1: "Yes",
    ipv: "Yes",
    pcv: "Yes",
    measles: "Yes",
    dptHepB: "Yes",
  },
  {
    id: "29873",
    firstName: "Synabou",
    lastName: "Kamau",
    location: "",
    bcg: "Yes",
    bopc0: "Yes",
    bopv1: "Yes",
    ipv: "Yes",
    pcv: "Yes",
    measles: "Yes",
    dptHepB: "Yes",
  },
];

function App() {
  const [data, setData] = useState(INITIAL_DATA);

  const handleAddRow = () => {
    const newRow = COLUMNS.reduce((acc, col) => {
      acc[col.id] = "";
      return acc;
    }, {} as any);
    setData([...data, newRow]);
  };

  return (
    <>
      <CssVariables colors spacers />
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.header}>
            <h2>Form: Laboratory results</h2>
          </div>
          <GridForm columns={COLUMNS} data={data} onChange={setData} />
        </div>
        <button className={styles.addButton} onClick={handleAddRow}>
          + Add row
        </button>
      </div>
    </>
  );
}

export default App;
