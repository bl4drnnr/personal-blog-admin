import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  forwardRef
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { StaticAssetsService } from '@shared/services/static-assets.service';
import { StaticAsset } from '@payloads/static-asset.interface';

@Component({
  selector: 'asset-selector',
  templateUrl: './asset-selector.component.html',
  styleUrls: ['./asset-selector.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AssetSelectorComponent),
      multi: true
    }
  ]
})
export class AssetSelectorComponent
  implements OnInit, OnDestroy, ControlValueAccessor
{
  @Input() label: string = 'Select Asset';
  @Input() placeholder: string = 'Search for assets...';
  @Input() disabled: boolean = false;
  @Output() assetSelected = new EventEmitter<StaticAsset | null>();

  searchTerm: string = '';
  selectedAsset: StaticAsset | null = null;
  assets: StaticAsset[] = [];
  loading: boolean = false;
  showDropdown: boolean = false;

  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  // ControlValueAccessor implementation
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private onChange = (_: string | null) => {};
  private onTouched = () => {};

  constructor(private staticAssetsService: StaticAssetsService) {}

  ngOnInit() {
    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((searchTerm) => {
        this.searchAssets(searchTerm);
      });

    // Load initial assets
    this.searchAssets('');
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ControlValueAccessor methods
  writeValue(value: string | null): void {
    if (value) {
      // Find the asset by ID and set it as selected
      const asset = this.assets.find((a) => a.id === value);
      if (asset) {
        this.selectedAsset = asset;
        this.searchTerm = asset.name;
      }
    } else {
      this.selectedAsset = null;
      this.searchTerm = '';
    }
  }

  registerOnChange(fn: (value: string | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchTerm = target.value;
    this.searchSubject.next(this.searchTerm);
    this.showDropdown = true;

    // Clear selection if user is typing
    if (this.selectedAsset && this.selectedAsset.name !== this.searchTerm) {
      this.selectedAsset = null;
      this.onChange(null);
      this.assetSelected.emit(null);
    }
  }

  onFocus(): void {
    this.showDropdown = true;
    this.onTouched();
  }

  onBlur(): void {
    // Delay hiding dropdown to allow clicks on options
    setTimeout(() => {
      this.showDropdown = false;
    }, 200);
  }

  selectAsset(asset: StaticAsset): void {
    this.selectedAsset = asset;
    this.searchTerm = asset.name;
    this.showDropdown = false;
    this.onChange(asset.id);
    this.assetSelected.emit(asset);
  }

  clearSelection(): void {
    this.selectedAsset = null;
    this.searchTerm = '';
    this.showDropdown = false;
    this.onChange(null);
    this.assetSelected.emit(null);
  }

  private searchAssets(searchTerm: string): void {
    this.loading = true;

    this.staticAssetsService
      .getStaticAssets({
        search: searchTerm,
        page: 0,
        pageSize: 20,
        orderBy: 'createdAt',
        order: 'DESC'
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.assets = response.assets;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading assets:', error);
          this.assets = [];
          this.loading = false;
        }
      });
  }
}
