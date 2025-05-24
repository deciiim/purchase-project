import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProjectService } from './projet.service';
import { Project } from '../../models/project.model';

@Component({
  selector: 'app-createpro',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pro.component.html',
  styleUrls: ['./pro.component.scss'],
  providers: [ProjectService]
})
export class CreateproComponent implements OnInit {
  project: Project = { title: '', description: '' };
  editingId?: number;

  constructor(private router: Router, private projectService: ProjectService) {}

  ngOnInit() {
    const editingProject = localStorage.getItem('editingProject');
    if (editingProject) {
      const parsed = JSON.parse(editingProject);
      this.project = parsed;
      this.editingId = parsed.id;
      localStorage.removeItem('editingProject');
    }
  }

  saveProject() {
    if (!this.project.title) {
      alert('Le titre est obligatoire.');
      return;
    }

    if (this.editingId) {
      this.projectService.updateProject(this.editingId, this.project).subscribe({
        next: () => {
          alert('Projet mis à jour avec succès !');
          this.router.navigate(['/projectlist']);
        },
        error: (err) => alert('Erreur: ' + err.error.message)
      });
    } else {
      this.projectService.createProject(this.project).subscribe({
        next: () => {
          alert('Projet ajouté avec succès !');
          this.router.navigate(['/projectlist']);
        },
        error: (err) => alert('Erreur: ' + err.error.message)
      });
    }
  }

  goToHome() {
    this.router.navigate(['/responsable']);
  }

  goToProjects() {
    this.router.navigate(['/projectlist']);
  }
  today = new Date();

}
