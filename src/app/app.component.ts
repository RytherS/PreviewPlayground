import { Color, NgxMatColorPickerComponent } from '@angular-material-components/color-picker';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Subscription, tap } from 'rxjs';

interface PreviewConfig {
  headerBackgroundColor: Color;
  headerTextColor: Color;
  bodyBackgroundColor: Color;
  buttonBackgroundColor: Color;
  buttonTextColor: Color;
}

interface PreviewConfigForm {
  headerBackgroundColor: FormControl<Color | null>;
  headerTextColor: FormControl<Color | null>;
  bodyBackgroundColor: FormControl<Color | null>;
  buttonBackgroundColor: FormControl<Color | null>;
  buttonTextColor: FormControl<Color | null>;
}

const defaultPreviewConfig: PreviewConfig = {
  headerBackgroundColor: new Color(255, 255, 255, 1),
  headerTextColor: new Color(0, 0, 0, 1),
  bodyBackgroundColor: new Color(255, 255, 255, 1),
  buttonBackgroundColor: new Color(170, 170, 170, 1),
  buttonTextColor: new Color(0, 0, 0, 1)
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

  @ViewChild('header', { static: true })
  private headerElement!: ElementRef;
  @ViewChild('headerText', { static: true })
  private headerTextElement!: ElementRef;
  @ViewChild('bodyContent', { static: true })
  private bodyContentElement!: ElementRef;
  @ViewChild('button', { static: true })
  private buttonElement!: ElementRef;

  @ViewChild('bodyBackgroundColorButton', { static: true })
  private bodyBackgroundColorButton!: ElementRef;

  public get headerTextColorFormControl(): FormControl {
    return this.formGroup.get('headerTextColor') as FormControl;
  }

  constructor(fb: FormBuilder) {
    this.formGroup = fb.group<PreviewConfigForm>({
      headerBackgroundColor: fb.control(defaultPreviewConfig.headerBackgroundColor),
      headerTextColor: fb.control(defaultPreviewConfig.headerTextColor),
      bodyBackgroundColor: fb.control(defaultPreviewConfig.bodyBackgroundColor),
      buttonBackgroundColor: fb.control(defaultPreviewConfig.buttonBackgroundColor),
      buttonTextColor: fb.control(defaultPreviewConfig.buttonTextColor)
    });
  }

  public ngOnInit(): void {
    this.updatePreviewStyles(defaultPreviewConfig);

    this.changesSub$ = this.formGroup.valueChanges.pipe(
      tap((previewConfig: PreviewConfig) => {
        this.updatePreviewStyles(previewConfig);
      }) 
    ).subscribe();
  }

  private updatePreviewStyles(previewConfig: PreviewConfig): void {
    if (previewConfig == null) return;

    if (this.headerElement) {
      this.headerElement.nativeElement.style.backgroundColor = previewConfig.headerBackgroundColor.toHexString();
    }
    if (this.headerTextElement) {
      this.headerTextElement.nativeElement.style.color = previewConfig.headerTextColor.hex;
    }

    if (this.bodyContentElement && this.bodyBackgroundColorButton) {
      this.bodyContentElement.nativeElement.style.backgroundColor = previewConfig.bodyBackgroundColor?.toHexString();
      this.bodyBackgroundColorButton.nativeElement.style.backgroundColor = previewConfig.bodyBackgroundColor?.toHexString();
    }

    if (this.buttonElement) {
      this.buttonElement.nativeElement.style.backgroundColor = previewConfig.buttonBackgroundColor.hex;
      this.buttonElement.nativeElement.style.color = previewConfig.buttonTextColor.hex;
    }
  }

  public openSwatch(colorPicker: NgxMatColorPickerComponent): void {
    colorPicker.open();
  }

  public clearColor(controlName: string): void {
    this.formGroup.get(controlName)?.patchValue(new Color(0, 0, 0, 1));
  }

  public logValues(): void {
    console.log(this.getValues());
  }

  private getValues(): any {
    const config = this.formGroup.value as PreviewConfig;
    return {
      headerBackgroundColor: config.headerBackgroundColor.hex,
      headerTextColor: config.headerTextColor.hex,
      bodyBackgroundColor: config.bodyBackgroundColor.hex,
      buttonBackgroundColor: config.buttonBackgroundColor.hex,
      buttonTextColor: config.buttonTextColor.hex
    }
  }

  public ngOnDestroy(): void {
    this.changesSub$.unsubscribe();
  }
}
