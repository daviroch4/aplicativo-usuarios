import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/app/models/usuario.model';

@Component({
  selector: 'app-lista-usuarios',
  templateUrl: './lista-usuarios.component.html',
  styleUrls: ['./lista-usuarios.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class ListaUsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];
  carregando: boolean = true;

  constructor(
    private usuarioService: UsuarioService,
    private router: Router
  ) { }

  ngOnInit() {
    this.carregarUsuarios();
  }

  carregarUsuarios(): void {
    this.carregando = true;
    this.usuarioService.getUsuarios().subscribe({
      next: (response: any) => {
        console.log('Resposta da API:', response);
        console.log('Usuários:', response.users);
        console.log('Primeiro usuário:', response.users[0]);
        this.usuarios = response.users;
        this.carregando = false;
      },
      error: (erro: any) => {
        console.error('Erro ao carregar usuários:', erro);
        this.carregando = false;
      }
    });
  }

  formatarData(data: string): string {
    const date = new Date(data);
    const dia = String(date.getDate()).padStart(2, '0');
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const ano = date.getFullYear();
    return `${dia}/${mes}/${ano}`;
  }

  editarUsuario(id: number): void {
    this.router.navigate(['/usuarios/editar', id]);
  }
}