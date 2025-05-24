import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';  // <-- import FormsModule

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    FormsModule, // <-- add here
  ],
  template: `<router-outlet></router-outlet>`
})
export class AppComponent {}
