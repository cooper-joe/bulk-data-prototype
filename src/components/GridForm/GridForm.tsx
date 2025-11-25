import React from "react";
import {
  FlyoutMenu,
  MenuDivider,
  MenuItem,
  Popover,
  IconMore16,
  Modal,
  ModalTitle,
  ModalContent,
  ModalActions,
  Button,
  ButtonStrip,
  Input,
  Radio,
  Checkbox,
  AlertBar,
} from "@dhis2/ui";
import styles from "./GridForm.module.css";
import { GridRow } from "./GridRow";
import type { Column } from "./types";

interface GridFormProps {
  columns: Column[];
  data: any[];
  onChange: (data: any[]) => void;
}

export const GridForm: React.FC<GridFormProps> = ({
  columns,
  data,
  onChange,
}) => {
  const [activeColumnId, setActiveColumnId] = React.useState<string | null>(
    null
  );
  const [hoveredColumnId, setHoveredColumnId] = React.useState<string | null>(
    null
  );
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  // Modal state for "Apply value to all column cells"
  const [applyValueModalOpen, setApplyValueModalOpen] = React.useState(false);
  const [applyValueColumnId, setApplyValueColumnId] = React.useState<
    string | null
  >(null);
  const [applyValue, setApplyValue] = React.useState("");
  const [overwriteExisting, setOverwriteExisting] = React.useState(true);

  // Undo stack state (single undo)
  const [undoSnapshot, setUndoSnapshot] = React.useState<any[] | null>(null);
  const [undoMessage, setUndoMessage] = React.useState<string | null>(null);
  const undoTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  const activeColumn = applyValueColumnId
    ? columns.find((col) => col.id === applyValueColumnId)
    : null;

  // Save snapshot and show undo alert
  const triggerUndoAlert = (previousData: any[], message: string) => {
    // Clear any existing timeout
    if (undoTimeoutRef.current) {
      clearTimeout(undoTimeoutRef.current);
    }
    setUndoSnapshot(previousData);
    setUndoMessage(message);
    // Auto-hide after 10 seconds
    undoTimeoutRef.current = setTimeout(() => {
      setUndoSnapshot(null);
      setUndoMessage(null);
    }, 10000);
  };

  const handleUndo = () => {
    if (undoSnapshot) {
      onChange(undoSnapshot);
      setUndoSnapshot(null);
      setUndoMessage(null);
      if (undoTimeoutRef.current) {
        clearTimeout(undoTimeoutRef.current);
      }
    }
  };

  const dismissUndoAlert = () => {
    setUndoSnapshot(null);
    setUndoMessage(null);
    if (undoTimeoutRef.current) {
      clearTimeout(undoTimeoutRef.current);
    }
  };

  // Cleanup timeout on unmount
  React.useEffect(() => {
    return () => {
      if (undoTimeoutRef.current) {
        clearTimeout(undoTimeoutRef.current);
      }
    };
  }, []);

  const handleHeaderClick = (
    event: React.MouseEvent<HTMLDivElement>,
    columnId: string
  ) => {
    setAnchorEl(event.currentTarget);
    setActiveColumnId(columnId);
  };

  const handleClose = () => {
    setActiveColumnId(null);
    setAnchorEl(null);
  };

  const handleRowChange = (index: number, updatedRow: any) => {
    const newData = [...data];
    newData[index] = updatedRow;
    onChange(newData);
  };

  const handleRemoveRow = (index: number) => {
    const newData = data.filter((_, i) => i !== index);
    onChange(newData);
  };

  const handleClearRow = (index: number) => {
    const clearedRow = columns.reduce((acc, col) => {
      acc[col.id] = col.readOnly ? data[index][col.id] : "";
      return acc;
    }, {} as any);
    const newData = [...data];
    newData[index] = clearedRow;
    onChange(newData);
  };

  const handleCopyToNextRow = (index: number) => {
    if (index < data.length - 1) {
      const sourceRow = data[index];
      const newData = [...data];
      newData[index + 1] = columns.reduce((acc, col) => {
        acc[col.id] = col.readOnly
          ? data[index + 1][col.id]
          : sourceRow[col.id];
        return acc;
      }, {} as any);
      onChange(newData);
    }
  };

  const handleCopyToAllRows = (index: number) => {
    const previousData = [...data.map((row) => ({ ...row }))];
    const sourceRow = data[index];
    const newData = data.map((row, i) => {
      if (i === index) return row;
      return columns.reduce((acc, col) => {
        acc[col.id] = col.readOnly ? row[col.id] : sourceRow[col.id];
        return acc;
      }, {} as any);
    });
    onChange(newData);
    triggerUndoAlert(previousData, "Applied values to all rows.");
  };

  const handleOpenApplyValueModal = (columnId: string) => {
    setApplyValueColumnId(columnId);
    setApplyValue("");
    setOverwriteExisting(true);
    setApplyValueModalOpen(true);
    handleClose();
  };

  const handleCloseApplyValueModal = () => {
    setApplyValueModalOpen(false);
    setApplyValueColumnId(null);
    setApplyValue("");
    setOverwriteExisting(true);
  };

  const handleApplyValueToColumn = () => {
    if (!applyValueColumnId) return;

    const previousData = [...data.map((row) => ({ ...row }))];
    const columnLabel =
      columns.find((c) => c.id === applyValueColumnId)?.label ||
      applyValueColumnId;

    const newData = data.map((row) => {
      const currentValue = row[applyValueColumnId];
      const hasValue =
        currentValue !== "" &&
        currentValue !== null &&
        currentValue !== undefined;

      // Skip cells that have a value if overwrite is disabled
      if (hasValue && !overwriteExisting) {
        return row;
      }

      return {
        ...row,
        [applyValueColumnId]: applyValue,
      };
    });
    onChange(newData);
    triggerUndoAlert(previousData, `Applied value to "${columnLabel}" column.`);
    handleCloseApplyValueModal();
  };

  const handleClearColumn = (columnId: string) => {
    const previousData = [...data.map((row) => ({ ...row }))];
    const columnLabel =
      columns.find((c) => c.id === columnId)?.label || columnId;

    const newData = data.map((row) => ({
      ...row,
      [columnId]: "",
    }));
    onChange(newData);
    triggerUndoAlert(previousData, `Cleared "${columnLabel}" column.`);
    handleClose();
  };

  const highlightedColumnId = hoveredColumnId || activeColumnId;

  return (
    <div className={styles.gridContainer}>
      <div className={styles.headerRow}>
        {columns.map((col) => (
          <div
            key={col.id}
            className={`${styles.headerCell} ${
              highlightedColumnId === col.id && !col.readOnly
                ? styles.headerCellHighlighted
                : ""
            } ${col.readOnly ? styles.headerCellReadOnly : ""}`}
            style={{ width: col.width, minWidth: col.width }}
            onClick={
              col.readOnly ? undefined : (e) => handleHeaderClick(e, col.id)
            }
            onMouseEnter={
              col.readOnly ? undefined : () => setHoveredColumnId(col.id)
            }
            onMouseLeave={
              col.readOnly ? undefined : () => setHoveredColumnId(null)
            }
          >
            <span className={styles.headerLabel}>{col.label}</span>
            {!col.readOnly && (
              <span
                className={`${styles.headerIcon} ${
                  hoveredColumnId === col.id
                    ? styles.headerIconVisible
                    : styles.headerIconHidden
                }`}
              >
                <IconMore16 />
              </span>
            )}
          </div>
        ))}
        <div className={styles.actionHeader}></div>
      </div>

      {activeColumnId && anchorEl && (
        <Popover
          reference={{ current: anchorEl }}
          placement="bottom-start"
          onClickOutside={handleClose}
          arrow={false}
        >
          <FlyoutMenu dense>
            <MenuItem
              label="Apply value to all column cells"
              onClick={() => handleOpenApplyValueModal(activeColumnId)}
            />
            <MenuDivider />
            <MenuItem
              destructive
              label="Clear all column cells"
              onClick={() => handleClearColumn(activeColumnId)}
            />
          </FlyoutMenu>
        </Popover>
      )}

      {applyValueModalOpen && activeColumn && (
        <Modal onClose={handleCloseApplyValueModal} position="middle">
          <ModalTitle>Apply value to "{activeColumn.label}"</ModalTitle>
          <ModalContent>
            <div className={styles.modalContent}>
              <p className={styles.modalDescription}>
                Enter a value to apply to all {data.length} rows in this column.
              </p>
              {activeColumn.type === "text" ? (
                <Input
                  value={applyValue}
                  onChange={({ value }: { value?: string }) =>
                    setApplyValue(value ?? "")
                  }
                  placeholder="Enter value..."
                />
              ) : activeColumn.type === "radio" && activeColumn.options ? (
                <div className={styles.modalRadioGroup}>
                  {activeColumn.options.map((option) => (
                    <Radio
                      key={option}
                      label={option}
                      value={option}
                      checked={applyValue === option}
                      onChange={({ value }: { value?: string }) =>
                        setApplyValue(value ?? "")
                      }
                      name="apply-value-radio"
                    />
                  ))}
                </div>
              ) : null}
              <div className={styles.modalCheckbox}>
                <Checkbox
                  checked={overwriteExisting}
                  onChange={({ checked }: { checked: boolean }) =>
                    setOverwriteExisting(checked)
                  }
                  label="Overwrite cells that already have a value"
                />
              </div>
            </div>
          </ModalContent>
          <ModalActions>
            <ButtonStrip end>
              <Button onClick={handleCloseApplyValueModal}>Cancel</Button>
              <Button
                primary
                onClick={handleApplyValueToColumn}
                disabled={!applyValue}
              >
                Apply to all rows
              </Button>
            </ButtonStrip>
          </ModalActions>
        </Modal>
      )}

      <div className={styles.body}>
        {data.map((row, index) => (
          <GridRow
            key={index}
            index={index}
            columns={columns}
            data={row}
            onChange={(updatedRow) => handleRowChange(index, updatedRow)}
            highlightedColumnId={highlightedColumnId}
            totalRows={data.length}
            onViewForm={() => console.log("View form for row", index)}
            onAboutPerson={() => console.log("About person for row", index)}
            onCopyValues={() => {
              const editableData = columns.reduce((acc, col) => {
                if (!col.readOnly) acc[col.id] = row[col.id];
                return acc;
              }, {} as any);
              navigator.clipboard.writeText(JSON.stringify(editableData));
              console.log("Copied values from row", index);
            }}
            onCopyToNextRow={() => handleCopyToNextRow(index)}
            onCopyToAllRows={() => handleCopyToAllRows(index)}
            onPasteValues={async () => {
              try {
                const text = await navigator.clipboard.readText();
                const pastedData = JSON.parse(text);
                const newRow = { ...row };
                columns.forEach((col) => {
                  if (!col.readOnly && pastedData[col.id] !== undefined) {
                    newRow[col.id] = pastedData[col.id];
                  }
                });
                handleRowChange(index, newRow);
                console.log("Pasted values to row", index);
              } catch (e) {
                console.error("Failed to paste values", e);
              }
            }}
            onClearRow={() => handleClearRow(index)}
            onRemoveRow={() => handleRemoveRow(index)}
          />
        ))}
      </div>

      {undoMessage && (
        <div className={styles.alertContainer}>
          <AlertBar
            duration={10000}
            onHidden={dismissUndoAlert}
            actions={[{ label: "Undo", onClick: handleUndo }]}
          >
            {undoMessage}
          </AlertBar>
        </div>
      )}
    </div>
  );
};
