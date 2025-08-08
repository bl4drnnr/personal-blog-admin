import { Injectable } from '@angular/core';
import { TableData } from '@components/table-editor/table-editor.component';

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

  // Convert content for saving (replace tokens with HTML + metadata comments)
  processContentForSave(content: string): string {
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
        const tableMetadata = this.encodeTableMetadata(tableData);

        // Wrap HTML with comment markers containing metadata
        const wrappedTable = `<!-- [TABLE_${tableId}:${tableMetadata}] -->\n${tableHtml}\n<!-- [/TABLE_${tableId}] -->`;
        processedContent = processedContent.replace(placeholder, wrappedTable);
      }
    }

    return processedContent;
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

  // Encode table metadata for storage in HTML comments
  private encodeTableMetadata(tableData: TableData): string {
    const metadata = {
      headers: tableData.headers || [],
      rows: tableData.rows
    };
    return btoa(JSON.stringify(metadata)); // Base64 encode to avoid HTML issues
  }

  // Decode table metadata from HTML comments
  private decodeTableMetadata(encodedData: string): {
    headers: string[];
    rows: string[][];
  } {
    try {
      return JSON.parse(atob(encodedData));
    } catch (error) {
      console.error('Error decoding table metadata:', error);
      return { headers: [], rows: [] };
    }
  }

  // Parse content loaded from backend and restore table data + tokens
  parseContentFromBackend(content: string): string {
    this.clearTables();

    let parsedContent = content;

    // Find all table comment blocks
    const tableBlockRegex =
      /<!-- \[TABLE_([^:]+):([^\]]+)\] -->\s*<table[^>]*>[\s\S]*?<\/table>\s*<!-- \[\/TABLE_\1\] -->/g;
    let match;

    while ((match = tableBlockRegex.exec(content)) !== null) {
      const tableId = match[1];
      const encodedMetadata = match[2];
      const fullBlock = match[0];

      // Decode table data
      const metadata = this.decodeTableMetadata(encodedMetadata);

      // Recreate table data
      const tableData: TableData = {
        id: tableId,
        headers: metadata.headers,
        rows: metadata.rows
      };

      // Store in service
      this.storeTable(tableData);

      // Replace HTML block with token
      const token = `[TABLE_${tableId}]`;
      parsedContent = parsedContent.replace(fullBlock, token);
    }

    return parsedContent;
  }

  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}
