import { Injectable } from '@angular/core';
import { TableData } from '../components/basic-components/table-editor/table-editor.component';

@Injectable({
  providedIn: 'root'
})
export class TableContentService {
  private tables: Map<string, TableData> = new Map();

  constructor() {}

  // Store table data
  storeTable(tableData: TableData): void {
    this.tables.set(tableData.id, tableData);
  }

  // Get table data by ID
  getTable(id: string): TableData | undefined {
    return this.tables.get(id);
  }

  // Get all stored tables
  getAllTables(): TableData[] {
    return Array.from(this.tables.values());
  }

  // Remove table
  removeTable(id: string): void {
    this.tables.delete(id);
  }

  // Clear all tables
  clearTables(): void {
    this.tables.clear();
  }

  // Generate table placeholder
  generateTablePlaceholder(tableId: string): string {
    return `[TABLE_${tableId}]`;
  }

  // Convert table data to HTML
  tableToHtml(tableData: TableData): string {
    let html = `<table>\n`;

    // Add header
    if (tableData.headers && tableData.headers.length > 0) {
      html += '  <thead>\n    <tr>\n';
      tableData.headers.forEach((header) => {
        html += `      <th>${this.escapeHtml(header)}</th>\n`;
      });
      html += '    </tr>\n  </thead>\n';
    }

    // Add body
    html += '  <tbody>\n';
    tableData.rows.forEach((row) => {
      html += '    <tr>\n';
      row.forEach((cell) => {
        html += `      <td>${this.escapeHtml(cell)}</td>\n`;
      });
      html += '    </tr>\n';
    });
    html += '  </tbody>\n</table>';

    return html;
  }

  // Convert content with placeholders to final HTML (for preview)
  processContent(content: string): string {
    let processedContent = content;

    // Find all table placeholders
    const placeholderRegex = /\[TABLE_([^\]]+)\]/g;
    let match;

    while ((match = placeholderRegex.exec(content)) !== null) {
      const tableId = match[1];
      const placeholder = match[0];
      const tableData = this.getTable(tableId);

      if (tableData) {
        const tableHtml = this.tableToHtml(tableData);
        processedContent = processedContent.replace(placeholder, tableHtml);
      }
    }

    return processedContent;
  }

  // Convert content for saving (replace tokens with final HTML)
  processContentForSave(content: string): string {
    return this.processContent(content);
  }

  // Extract table placeholders from content
  extractTableIds(content: string): string[] {
    const placeholderRegex = /\[TABLE_([^\]]+)\]/g;
    const tableIds: string[] = [];
    let match;

    while ((match = placeholderRegex.exec(content)) !== null) {
      tableIds.push(match[1]);
    }

    return tableIds;
  }

  // Load tables from existing content (reverse process - extract tokens and recreate table data)
  loadFromContent(content: string, existingTables: TableData[] = []): void {
    this.clearTables();

    // Store any provided table data
    existingTables.forEach((table) => {
      this.storeTable(table);
    });

    // Extract table IDs that are referenced in content
    const referencedIds = this.extractTableIds(content);

    // Remove any unreferenced tables
    const currentTables = this.getAllTables();
    currentTables.forEach((table) => {
      if (!referencedIds.includes(table.id)) {
        this.removeTable(table.id);
      }
    });
  }

  // Load tables from content (for editing existing content)
  loadTablesFromContent(content: string, tables: TableData[]): void {
    this.clearTables();
    tables.forEach((table) => {
      this.storeTable(table);
    });
  }

  // Get content with table placeholders (for saving)
  getContentWithPlaceholders(content: string): {
    content: string;
    tables: TableData[];
  } {
    return {
      content: content,
      tables: this.getAllTables()
    };
  }

  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}
