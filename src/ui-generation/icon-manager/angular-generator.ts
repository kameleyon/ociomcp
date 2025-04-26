import { IconManagerOptions } from './types';
import { formatComponentName, toKebabCase } from './utils';

/**
 * Generate Angular Icon Manager
 * 
 * @param iconFiles Map of file paths to content
 * @param options Icon Manager options
 */
export function generateAngularIconManager(iconFiles: Map<string, string>, options: IconManagerOptions): void {
  const {
    name,
    library,
    styling,
    typescript,
    icons = [],
    customIcons = [],
    options: iconOptions = {
      size: '24',
      stroke: '2',
      includeAll: false,
      lazyLoad: true,
      optimizeSVG: true
    }
  } = options;

  const managerName = formatComponentName(name);
  const kebabName = toKebabCase(name);
  const hasTypescript = typescript; // Angular always uses TypeScript
  const includeAll = iconOptions.includeAll;
  const lazyLoad = iconOptions.lazyLoad;
  const iconSize = iconOptions.size || '24';
  const iconColor = iconOptions.color;
  const iconStroke = iconOptions.stroke || '2';
  
  // Generate module file
  let moduleContent = `import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ${managerName}Component } from './${kebabName}.component';

@NgModule({
  declarations: [${managerName}Component],
  imports: [CommonModule],
  exports: [${managerName}Component]
})
export class ${managerName}Module { }
`;
  
  iconFiles.set(`${kebabName}.module.ts`, moduleContent);
  
  // Generate component file
  let componentContent = '';
  
  if (library === 'lucide') {
    componentContent = `import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as LucideIcons from 'lucide-angular';

@Component({
  selector: 'app-${kebabName}',
  template: \`
    <ng-container *ngIf="iconComponent">
      <ng-container *ngComponentOutlet="iconComponent; injector: iconInjector"></ng-container>
    </ng-container>
  \`,
  styles: []
})
export class ${managerName}Component implements OnChanges {
  @Input() name: string = '';
  @Input() size: string | number = ${iconSize};
  @Input() color: string = ${iconColor ? `'${iconColor}'` : 'undefined'};
  @Input() strokeWidth: string | number = ${iconStroke};
  
  iconComponent: any;
  iconInjector: any;
  
  ngOnChanges(changes: SimpleChanges): void {
    this.updateIcon();
  }
  
  private updateIcon(): void {
    // This is a placeholder implementation
    // Replace with the actual implementation for Lucide Angular
    this.iconComponent = LucideIcons[this.name] || LucideIcons.HelpCircle;
    
    // Create injector with the icon properties
    // This is a placeholder and should be replaced with the actual implementation
    this.iconInjector = {
      size: this.size,
      color: this.color,
      strokeWidth: this.strokeWidth
    };
  }
}
`;
  } else if (library === 'custom') {
    // Generate custom icons file
    let customIconsContent = `// Custom SVG icons
export const icons: { [key: string]: string } = {
${customIcons.map(icon => `  '${icon.name}': \`${icon.svg}\``).join(',\n')}
};
`;
    
    iconFiles.set(`custom-icons.ts`, customIconsContent);
    
    // Generate component file
    componentContent = `import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { icons } from './custom-icons';

@Component({
  selector: 'app-${kebabName}',
  template: \`
    <svg
      xmlns="http://www.w3.org/2000/svg"
      [attr.width]="sizeValue"
      [attr.height]="sizeValue"
      [attr.viewBox]="viewBox"
      [attr.stroke]="color"
      [attr.stroke-width]="strokeWidth"
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
      [innerHTML]="svgContent"
    ></svg>
  \`,
  styles: []
})
export class ${managerName}Component implements OnChanges {
  @Input() name: string = '';
  @Input() size: string | number = ${iconSize};
  @Input() color: string = ${iconColor ? `'${iconColor}'` : "'currentColor'"};
  @Input() strokeWidth: string | number = ${iconStroke};
  
  viewBox: string = '0 0 24 24';
  svgContent: SafeHtml;
  sizeValue: string;
  
  constructor(private sanitizer: DomSanitizer) {
    this.svgContent = this.sanitizer.bypassSecurityTrustHtml('');
    this.sizeValue = typeof this.size === 'number' ? \`\${this.size}px\` : this.size.toString();
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    this.updateIcon();
  }
  
  private updateIcon(): void {
    const iconSvg = icons[this.name] || '';
    
    if (!iconSvg) {
      console.warn(\`Icon "\${this.name}" not found\`);
      this.svgContent = this.sanitizer.bypassSecurityTrustHtml('');
      return;
    }
    
    // Parse SVG string to get attributes and content
    const parser = new DOMParser();
    const doc = parser.parseFromString(iconSvg, 'image/svg+xml');
    const svgElement = doc.querySelector('svg');
    
    if (!svgElement) {
      console.warn(\`Invalid SVG for icon "\${this.name}"\`);
      this.svgContent = this.sanitizer.bypassSecurityTrustHtml('');
      return;
    }
    
    // Get SVG content (everything inside the svg tag)
    const content = svgElement.innerHTML;
    
    // Get original viewBox
    const svgViewBox = svgElement.getAttribute('viewBox');
    if (svgViewBox) {
      this.viewBox = svgViewBox;
    }
    
    this.svgContent = this.sanitizer.bypassSecurityTrustHtml(content);
    this.sizeValue = typeof this.size === 'number' ? \`\${this.size}px\` : this.size.toString();
  }
}
`;
  } else {
    // Generic implementation for other libraries
    componentContent = `import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-${kebabName}',
  template: \`
    <svg
      xmlns="http://www.w3.org/2000/svg"
      [attr.width]="sizeValue"
      [attr.height]="sizeValue"
      viewBox="0 0 24 24"
      [attr.stroke]="color"
      [attr.stroke-width]="strokeWidth"
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="8" x2="12" y2="16"></line>
      <line x1="8" y1="12" x2="16" y2="12"></line>
    </svg>
  \`,
  styles: []
})
export class ${managerName}Component {
  @Input() name: string = '';
  @Input() size: string | number = ${iconSize};
  @Input() color: string = ${iconColor ? `'${iconColor}'` : "'currentColor'"};
  @Input() strokeWidth: string | number = ${iconStroke};
  
  get sizeValue(): string {
    return typeof this.size === 'number' ? \`\${this.size}px\` : this.size.toString();
  }
}
`;
  }
  
  iconFiles.set(`${kebabName}.component.ts`, componentContent);
  
  // Generate public API file
  let publicApiContent = `export * from './${kebabName}.component';
export * from './${kebabName}.module';
`;
  
  iconFiles.set(`public-api.ts`, publicApiContent);
  
  // Generate example usage file
  let exampleContent = `import { Component } from '@angular/core';

@Component({
  selector: 'app-icon-example',
  template: \`
    <div>
      <h1>Icon Examples</h1>
      
      <!-- Basic usage -->
      <div class="example-section">
        <h2>Basic Usage</h2>
        <app-${kebabName} name="${icons.length > 0 ? icons[0] : 'activity'}"></app-${kebabName}>
      </div>
      
      <!-- Custom size -->
      <div class="example-section">
        <h2>Custom Size</h2>
        <app-${kebabName} name="${icons.length > 0 ? icons[0] : 'activity'}" [size]="32"></app-${kebabName}>
      </div>
      
      <!-- Custom color -->
      <div class="example-section">
        <h2>Custom Color</h2>
        <app-${kebabName} name="${icons.length > 0 ? icons[0] : 'activity'}" color="red"></app-${kebabName}>
      </div>
      
      <!-- Custom stroke width -->
      <div class="example-section">
        <h2>Custom Stroke Width</h2>
        <app-${kebabName} name="${icons.length > 0 ? icons[0] : 'activity'}" [strokeWidth]="1"></app-${kebabName}>
      </div>
      
      <!-- Multiple icons -->
      <div class="example-section">
        <h2>Multiple Icons</h2>
        <div class="icon-grid">
          ${icons.slice(0, 5).map(icon => `<app-${kebabName} name="${icon}"></app-${kebabName}>`).join('\n          ')}
        </div>
      </div>
    </div>
  \`,
  styles: [\`
    .example-section {
      margin-bottom: 20px;
    }
    
    .icon-grid {
      display: flex;
      gap: 10px;
    }
  \`]
})
export class IconExampleComponent {}
`;
  
  iconFiles.set(`icon-example.component.ts`, exampleContent);
}
