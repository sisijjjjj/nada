import { Component, OnInit } from '@angular/core';
import { User } from 'src/_models/User.model';

import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-utilisateur',
  templateUrl: './list-utilisateur.component.html',
  styleUrls: ['./list-utilisateur.component.css']
})
export class ListUtilisateurComponent implements OnInit {
  users: User[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getAllUsers().subscribe(
      (data) => {
        this.users = data;
      },
      (error) => {
        console.error('Error loading users', error);
      }
    );
  }

  

  // Supprimer un utilisateur
  deleteUser(userId: number) {
    Swal.fire({
      title: 'Êtes-vous sûr?',
      text: "Cette action est irréversible!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer!',
      cancelButtonText: 'Annuler',
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.deleteUser(userId).subscribe(
          () => {
            // Swal.fire('Supprimé!', 'L\'utilisateur a été supprimé.', 'success');
            this.loadUsers(); // Recharger la liste après suppression
          },
          // (error) => {
          //   Swal.fire('Erreur!', 'Il y a eu une erreur lors de la suppression.', 'error');
          // }
        );
      }
    });
  }
}
