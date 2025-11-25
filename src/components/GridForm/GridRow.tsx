import React from "react";
import {
  Radio,
  FlyoutMenu,
  MenuDivider,
  MenuItem,
  Popover,
  IconMore16,
} from "@dhis2/ui";
import styles from "./GridRow.module.css";
import type { Column } from "./types";

interface GridRowProps {
  index: number;
  columns: Column[];
  data: any;
  onChange: (data: any) => void;
  highlightedColumnId: string | null;
  onViewForm: () => void;
  onAboutPerson: () => void;
  onCopyValues: () => void;
  onCopyToNextRow: () => void;
  onCopyToAllRows: () => void;
  onPasteValues: () => void;
  onClearRow: () => void;
  onRemoveRow: () => void;
  totalRows: number;
}

export const GridRow: React.FC<GridRowProps> = ({
  index,
  columns,
  data,
  onChange,
  highlightedColumnId,
  onViewForm,
  onAboutPerson,
  onCopyValues,
  onCopyToNextRow,
  onCopyToAllRows,
  onPasteValues,
  onClearRow,
  onRemoveRow,
  totalRows,
}) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const buttonRef = React.useRef<HTMLButtonElement>(null!); // non-null assertion for DHIS2 Popover

  const handleCellChange = (columnId: string, value: any) => {
    onChange({ ...data, [columnId]: value });
  };

  const handleMenuOpen = () => {
    setIsMenuOpen(true);
  };

  const handleMenuClose = () => {
    setIsMenuOpen(false);
  };

  const handleAction = (action: () => void) => {
    action();
    handleMenuClose();
  };

  const isLastRow = index === totalRows - 1;

  return (
    <div
      className={`${styles.row} ${index % 2 === 0 ? styles.even : styles.odd} ${
        isMenuOpen ? styles.rowActive : ""
      }`}
    >
      {columns.map((col) => (
        <div
          key={col.id}
          className={`${styles.cell} ${
            highlightedColumnId === col.id ? styles.cellHighlighted : ""
          } ${col.type === "text" && !col.readOnly ? styles.cellText : ""} ${
            col.readOnly ? styles.cellReadOnly : ""
          }`}
          style={{ width: col.width, minWidth: col.width }}
        >
          {col.readOnly ? (
            <span className={styles.readOnlyValue}>{data[col.id] || ""}</span>
          ) : col.type === "text" ? (
            <input
              type="text"
              className={styles.textInput}
              value={data[col.id] || ""}
              onChange={(e) => handleCellChange(col.id, e.target.value)}
            />
          ) : col.type === "radio" ? (
            <div className={styles.radioGroup}>
              {col.options?.map((option) => (
                <Radio
                  dense
                  key={option}
                  label={option}
                  value={option}
                  checked={data[col.id] === option}
                  onChange={({ value }: { value: string }) =>
                    handleCellChange(col.id, value)
                  }
                  name={`${col.id}-${index}`}
                />
              ))}
            </div>
          ) : null}
        </div>
      ))}
      <div
        className={`${styles.actionCell} ${
          isMenuOpen ? styles.actionCellActive : ""
        }`}
      >
        <button
          ref={buttonRef}
          className={styles.moreButton}
          onClick={handleMenuOpen}
        >
          <IconMore16 />
        </button>
        {isMenuOpen && buttonRef.current && (
          <Popover
            reference={buttonRef}
            placement="bottom-end"
            onClickOutside={handleMenuClose}
            arrow={false}
          >
            <FlyoutMenu dense>
              <MenuItem
                label="View form..."
                onClick={() => handleAction(onViewForm)}
              />
              <MenuItem
                label="About this person"
                onClick={() => handleAction(onAboutPerson)}
              />
              <MenuDivider />
              <MenuItem
                label="Copy all data values"
                onClick={() => handleAction(onCopyValues)}
              />

              <MenuItem
                label="Paste values"
                onClick={() => handleAction(onPasteValues)}
              />
              <MenuDivider />
              <MenuItem
                label="Apply all data values to next row"
                disabled={isLastRow}
                onClick={() => handleAction(onCopyToNextRow)}
              />
              <MenuItem
                label="Apply all data values to all rows"
                onClick={() => handleAction(onCopyToAllRows)}
              />
              <MenuDivider />
              <MenuItem
                destructive
                label="Clear all row values"
                onClick={() => handleAction(onClearRow)}
              />
              <MenuItem
                destructive
                label="Remove row"
                onClick={() => handleAction(onRemoveRow)}
              />
            </FlyoutMenu>
          </Popover>
        )}
      </div>
    </div>
  );
};
