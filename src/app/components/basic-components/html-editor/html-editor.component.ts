import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  OnDestroy,
  OnChanges
} from '@angular/core';
import { Editor, Toolbar } from 'ngx-editor';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TableContentService } from '../../../services/table-content.service';
import { TableData } from '../table-editor/table-editor.component';

@Component({
  selector: 'basic-html-editor',
  templateUrl: './html-editor.component.html',
  styleUrls: ['./html-editor.component.scss']
})
export class HtmlEditorComponent implements OnInit, OnChanges, OnDestroy {
  @Input() label: string = 'HTML Editor';
  @Input() value: string = '';
  @Input() disabled = false;
  @Input() showPreview = true;

  @Output() valueChange = new EventEmitter<string>();
  @Output() processedContentForSave = new EventEmitter<string>();

  editor: Editor;
  showHtmlSource = false;
  showTableEditor = false;
  editingTable: TableData | null = null;
  private hasBeenParsed = false;
  toolbar: Toolbar = [
    // default value
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'],
    // or, set options for link:
    //[{ link: { showOpenInNewTab: false } }, 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
    ['horizontal_rule', 'format_clear', 'indent', 'outdent'],
    ['superscript', 'subscript']
  ];

  constructor(
    private sanitizer: DomSanitizer,
    private tableContentService: TableContentService
  ) {
    this.editor = new Editor();
  }

  ngOnInit() {
    // Editor is initialized with value through template binding
    this.hasBeenParsed = false; // Reset flag on init
  }

  ngOnChanges() {
    // Parse content when value changes (from backend)
    if (this.value && this.value.includes('<!-- [TABLE_') && !this.hasBeenParsed) {
      this.parseBackendContent();
    }
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }

  onHtmlChange(content: string): void {
    this.valueChange.emit(content);
    this.emitProcessedContent(content);
  }

  onSourceChange(content: string): void {
    this.valueChange.emit(content);
    this.emitProcessedContent(content);
  }

  private emitProcessedContent(content: string): void {
    const processedContent = this.tableContentService.processContentForSave(content);
    this.processedContentForSave.emit(processedContent);
  }

  getSafeHtml(): SafeHtml {
    const processedContent = this.tableContentService.processContent(
      this.value || ''
    );
    return this.sanitizer.bypassSecurityTrustHtml(processedContent);
  }

  openTableEditor(): void {
    this.editingTable = null;
    this.showTableEditor = true;
  }

  onTableCreated(tableData: TableData): void {
    // Store the table
    this.tableContentService.storeTable(tableData);

    // Check if this is an edit or new table
    const placeholder = this.tableContentService.generateTablePlaceholder(
      tableData.id
    );
    const currentValue = this.value || '';

    // If editing (table already exists in content), just update the stored data
    // The content doesn't need to change since the placeholder is already there
    if (this.editingTable && currentValue.includes(placeholder)) {
      // Just update the processed content since table data changed
      this.emitProcessedContent(currentValue);
    } else {
      // New table - append placeholder to content
      const newValue = currentValue + '\n\n' + placeholder + '\n\n';
      this.valueChange.emit(newValue);
      this.emitProcessedContent(newValue);
    }
  }

  getTables(): TableData[] {
    return this.tableContentService.getAllTables();
  }

  editTable(tableData: TableData): void {
    this.editingTable = tableData;
    this.showTableEditor = true;
  }

  deleteTable(tableData: TableData): void {
    if (
      confirm(
        'Are you sure you want to delete this table? This will also remove it from your content.'
      )
    ) {
      // Remove from service
      this.tableContentService.removeTable(tableData.id);

      // Remove token from content
      const placeholder = this.tableContentService.generateTablePlaceholder(
        tableData.id
      );
      const currentValue = this.value || '';
      const newValue = currentValue.replace(
        new RegExp('\\s*' + this.escapeRegExp(placeholder) + '\\s*', 'g'),
        '\n\n'
      );
      const cleanedValue = newValue.replace(/\n\n\n+/g, '\n\n'); // Clean up multiple line breaks
      this.valueChange.emit(cleanedValue);
      this.emitProcessedContent(cleanedValue);
    }
  }

  private parseBackendContent(): void {
    if (this.value && !this.hasBeenParsed) {
      const parsedContent = this.tableContentService.parseContentFromBackend(
        this.value
      );

      // Only emit if content actually changed
      if (parsedContent !== this.value) {
        this.hasBeenParsed = true;
        // Use setTimeout to avoid ExpressionChangedAfterItHasBeenCheckedError
        setTimeout(() => {
          this.valueChange.emit(parsedContent);
        }, 0);
      }
    }
  }

  private escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  onTableModalClosed(): void {
    this.showTableEditor = false;
    this.editingTable = null;
  }
}
