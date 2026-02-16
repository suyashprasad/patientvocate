import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-results-page',
    standalone: true,
    imports: [RouterLink],
    template: `
    <div class="container" style="padding-top: 3rem; text-align: center;">
      <h2>No report loaded</h2>
      <p style="color: var(--text-secondary); margin: 1rem 0;">
        Please upload a report from the home page first.
      </p>
      <a routerLink="/" class="btn btn-primary">Go to Home</a>
    </div>
  `
})
export class ResultsPageComponent { }
