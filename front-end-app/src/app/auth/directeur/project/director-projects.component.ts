import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProjectService } from '../../createpro/projet.service';
import { Project } from '../../../models/project.model';

@Component({
  selector: 'app-director-projects',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './director-projects.component.html',
  styleUrls: ['./director-projects.component.scss']
})
export class DirectorProjectsComponent implements OnInit {
  projects: Project[] = [];
  filteredProjects: Project[] = [];
  searchTerm: string = '';

  totalProjects: number = 0;
  activeProjects: number = 0;
  completedProjects: number = 0;

  constructor(private projectService: ProjectService) {}

  ngOnInit() {
    this.loadProjects();
  }

  loadProjects() {
    this.projectService.getProjects().subscribe({
      next: (data) => {
        this.projects = data;
        this.filteredProjects = [...data];
        this.updateStats();
      },
      error: () => {
        alert('Erreur lors du chargement des projets');
      }
    });
  }

  filterProjects() {
    const searchTerm = this.searchTerm.toLowerCase().trim();
    if (!searchTerm) {
      this.filteredProjects = [...this.projects];
    } else {
      this.filteredProjects = this.projects.filter(project =>
        project.title.toLowerCase().includes(searchTerm) ||
        (project.description || '').toLowerCase().includes(searchTerm)
      );
    }
  }

  deleteProject(project: Project) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
      this.projectService.deleteProject(project.id!).subscribe({
        next: () => this.loadProjects(),
        error: () => alert('Erreur lors de la suppression du projet')
      });
    }
  }

  finishProject(project: Project) {
    this.projectService.updateProject(project.id!, { status: 'finished' }).subscribe({
      next: () => this.loadProjects(),
      error: () => alert('Erreur lors de la mise à jour du statut')
    });
  }

  updateStats() {
    this.totalProjects = this.projects.length;
    this.completedProjects = this.projects.filter(p => p.status === 'finished').length;
    this.activeProjects = this.totalProjects - this.completedProjects;
  }
}
