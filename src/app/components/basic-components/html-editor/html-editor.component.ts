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

  editor: Editor;
  showHtmlSource = false;
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

  constructor(private sanitizer: DomSanitizer) {
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
  }

  onSourceChange(content: string): void {
    this.valueChange.emit(content);
  }

  toggleView(): void {
    this.showHtmlSource = !this.showHtmlSource;
  }

  getSafeHtml(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.value || '');
  }
}
