import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-view-projects',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './view-projects.component.html',
  styleUrls: ['./view-projects.component.scss']
})
export class ViewProjectsComponent implements OnInit {
  currentDate = new Date();
  projects: any[] = [];
  filteredProjects: any[] = [];
  searchTerm: string = '';

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadProjects();
  }

  loadProjects() {
    const savedProjects = localStorage.getItem('projects');
    if (savedProjects) {
      this.projects = JSON.parse(savedProjects);
      this.filteredProjects = [...this.projects];
    }
  }

  filterProjects() {
    if (!this.searchTerm.trim()) {
      this.filteredProjects = [...this.projects];
      return;
    }

    const search = this.searchTerm.toLowerCase();
    this.filteredProjects = this.projects.filter(project => 
      project.name.toLowerCase().includes(search) ||
      project.description.toLowerCase().includes(search)
    );
  }

  goToHome() {
    this.router.navigate(['/projectlist']);
  }
} 