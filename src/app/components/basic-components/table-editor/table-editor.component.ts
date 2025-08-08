import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';

export interface TableData {
  id: string;
  rows: string[][];
  headers?: string[];
  styling: {
    className: string;
  };
}

@Component({
  selector: 'basic-table-editor',
  templateUrl: './table-editor.component.html',
  styleUrls: ['./table-editor.component.scss']
})
export class TableEditorComponent implements OnInit {
  @Input() isOpen = false;
  @Input() tableData: TableData | null = null;
  @Output() tableCreated = new EventEmitter<TableData>();
  @Output() modalClosed = new EventEmitter<void>();

  rows: string[][] = [];
  headers: string[] = [];
  numRows = 3;
  numCols = 3;
  isEditMode = false;

  ngOnInit() {
    if (this.tableData) {
      this.loadTableData();
    } else {
      this.initializeEmptyTable();
    }
  }

  initializeEmptyTable() {
    this.headers = Array(this.numCols)
      .fill('')
      .map((_, i) => `Header ${i + 1}`);
    this.rows = Array(this.numRows)
      .fill(null)
      .map((_, r) =>
        Array(this.numCols)
          .fill('')
          .map((_, c) => `Cell ${r + 1}-${c + 1}`)
      );
  }

  loadTableData() {
    if (this.tableData) {
      this.isEditMode = true;
      this.headers = [...(this.tableData.headers || [])];
      this.rows = this.tableData.rows.map((row) => [...row]);
      this.numRows = this.rows.length;
      this.numCols = this.headers.length;
    }
  }

  updateDimensions() {
    // Adjust headers
    while (this.headers.length < this.numCols) {
      this.headers.push(`Header ${this.headers.length + 1}`);
    }
    this.headers = this.headers.slice(0, this.numCols);

    // Adjust rows
    while (this.rows.length < this.numRows) {
      const newRow = Array(this.numCols)
        .fill('')
        .map((_, c) => `Cell ${this.rows.length + 1}-${c + 1}`);
      this.rows.push(newRow);
    }
    this.rows = this.rows.slice(0, this.numRows);

    // Adjust columns in existing rows
    this.rows = this.rows.map((row, r) => {
      while (row.length < this.numCols) {
        row.push(`Cell ${r + 1}-${row.length + 1}`);
      }
      return row.slice(0, this.numCols);
    });
  }

  createTable() {
    const tableData: TableData = {
      id: this.isEditMode ? this.tableData!.id : `table_${Date.now()}`,
      rows: this.rows.map((row) => [...row]),
      headers: [...this.headers],
      styling: {
        className: 'table table-bordered'
      }
    };

    this.tableCreated.emit(tableData);
    this.closeModal();
  }

  closeModal() {
    this.modalClosed.emit();
  }

  trackByIndex(index: number): number {
    return index;
  }
}
