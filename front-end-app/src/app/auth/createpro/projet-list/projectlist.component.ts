import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProjectService } from '../projet.service';
import { Project } from '../../../models/project.model';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './projectlist.component.html',
  styleUrls: ['./projectlist.component.scss']
})
export class ProjectListComponent implements OnInit {
  projects: Project[] = [];
  filteredProjects: Project[] = [];
  searchTerm = '';
  totalProjects = 0;
  activeProjects = 0;
  completedProjects = 0;
  today = new Date();

  constructor(private router: Router, private projectService: ProjectService) {}

  ngOnInit() {
    this.loadProjects();
  }

  loadProjects() {
    this.projectService.getProjects().subscribe({
      next: (data) => {
        this.projects = data;
        this.filteredProjects = [...data];
        this.updateProjectStats();
      },
      error: () => alert('Erreur de chargement des projets')
    });
  }

  updateProjectStats() {
    this.totalProjects = this.projects.length;
    this.activeProjects = this.projects.filter(p => p.status !== 'finished').length;
    this.completedProjects = this.projects.filter(p => p.status === 'finished').length;
  }

  filterProjects() {
    const search = this.searchTerm.toLowerCase();
    this.filteredProjects = this.projects.filter(project =>
      project.title.toLowerCase().includes(search) ||
      (project.description || '').toLowerCase().includes(search)
    );
  }

  editProject(project: Project) {
    localStorage.setItem('editingProject', JSON.stringify(project));
    this.router.navigate(['/createpro']);
  }

  deleteProject(project: Project) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
      this.projectService.deleteProject(project.id!).subscribe({
        next: () => this.loadProjects(),
        error: () => alert('Erreur lors de la suppression')
      });
    }
  }

  finishProject(project: Project) {
    this.projectService.updateProject(project.id!, { status: 'finished' }).subscribe({
      next: () => this.loadProjects(),
      error: () => alert('Erreur lors de la mise à jour du statut du projet')
    });
  }

  goToCreateProject() {
    this.router.navigate(['/createpro']);
  }

  goToHome() {
    this.router.navigate(['/responsable']);
  }
}
