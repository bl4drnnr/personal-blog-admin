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
  }

  ngOnChanges() {
    // Value changes are handled through template binding
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

  toggleView(): void {
    this.showHtmlSource = !this.showHtmlSource;
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

    // Insert placeholder at cursor position in the editor
    const placeholder = this.tableContentService.generateTablePlaceholder(
      tableData.id
    );

    // For now, append to the content - in a real implementation, we'd insert at cursor position
    const currentValue = this.value || '';
    const newValue = currentValue + '\n\n' + placeholder + '\n\n';
    this.valueChange.emit(newValue);
    this.emitProcessedContent(newValue);
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

  getProcessedContentForSave(): string {
    return this.tableContentService.processContentForSave(this.value || '');
  }

  private escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  onTableModalClosed(): void {
    this.showTableEditor = false;
    this.editingTable = null;
  }
}
