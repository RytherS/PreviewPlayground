import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Subscription, tap } from 'rxjs';

interface PreviewConfig {
  headerBackgroundColor: string;
  headerTextColor: string;
  bodyBackgroundColor: string;
  buttonBackgroundColor: string;
  buttonTextColor: string;
}

interface PreviewConfigForm {
  headerBackgroundColor: FormControl<string | null>;
  headerTextColor: FormControl<string | null>;
  bodyBackgroundColor: FormControl<string | null>;
  buttonBackgroundColor: FormControl<string | null>;
  buttonTextColor: FormControl<string | null>;
}

const defaultPreviewConfig: PreviewConfig = {
  headerBackgroundColor: '#FFFFFF',
  headerTextColor: '#000000',
  bodyBackgroundColor: '#FFFFFF',
  buttonBackgroundColor: '#AAAAAA',
  buttonTextColor: '#000000'
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'playground';

  public formGroup: FormGroup;
  private changesSub$!: Subscription;

  private headerElement!: HTMLElement;
  private headerTextElement!: HTMLElement;
  private bodyContentElement!: HTMLElement;
  private buttonElement!: HTMLElement;

  public get headerTextColorFormControl(): FormControl {
    return this.formGroup.get('headerTextColor') as FormControl;
  }

  constructor(fb: FormBuilder) {
    this.initHtmlElements();

    this.formGroup = fb.group<PreviewConfigForm>({
      headerBackgroundColor: fb.control(defaultPreviewConfig.headerBackgroundColor),
      headerTextColor: fb.control(defaultPreviewConfig.headerTextColor),
      bodyBackgroundColor: fb.control(defaultPreviewConfig.bodyBackgroundColor),
      buttonBackgroundColor: fb.control(defaultPreviewConfig.buttonBackgroundColor),
      buttonTextColor: fb.control(defaultPreviewConfig.buttonTextColor)
    });
  }

  public ngOnInit(): void {
    this.initHtmlElements();
    this.updatePreviewStyles(defaultPreviewConfig);

    this.changesSub$ = this.formGroup.valueChanges.pipe(
      tap((previewConfig: PreviewConfig) => {
        this.updatePreviewStyles(previewConfig);
      }) 
    ).subscribe();
  }

  private initHtmlElements(): void {
    this.headerElement = document.getElementById('header') as HTMLElement;
    this.headerTextElement = document.getElementById('header-text') as HTMLElement;
    this.bodyContentElement = document.getElementById('body-content') as HTMLElement;
    this.buttonElement = document.getElementById('button') as HTMLElement;
  }

  private updatePreviewStyles(previewConfig: PreviewConfig): void {
    if (previewConfig == null) return;

    if (this.headerElement) {
      this.headerElement.style.backgroundColor = previewConfig.headerBackgroundColor;
    }
    if (this.headerTextElement) {
      this.headerTextElement.style.color = previewConfig.headerTextColor;
    }

    if (this.bodyContentElement) {
      this.bodyContentElement.style.backgroundColor = previewConfig.bodyBackgroundColor;
    }

    if (this.buttonElement) {
      this.buttonElement.style.backgroundColor = previewConfig.buttonBackgroundColor;
      this.buttonElement.style.color = previewConfig.buttonTextColor;
    }
  }

  public ngOnDestroy(): void {
    this.changesSub$.unsubscribe();
  }
}
