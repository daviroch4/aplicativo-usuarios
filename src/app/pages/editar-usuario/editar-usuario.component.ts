import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/app/models/usuario.model';

@Component({
  selector: 'app-editar-usuario',
  templateUrl: './editar-usuario.component.html',
  styleUrls: ['./editar-usuario.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule, ReactiveFormsModule]
})
export class EditarUsuarioComponent implements OnInit {
  formulario!: FormGroup;
  usuarioId!: number;
  carregando: boolean = true;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private usuarioService: UsuarioService
  ) { }

  ngOnInit() {
    this.criarFormulario();
    this.usuarioId = Number(this.route.snapshot.paramMap.get('id'));
    this.carregarUsuario();
  }

  criarFormulario(): void {
    this.formulario = this.fb.group({
      id: [{ value: '', disabled: true }],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      password: ['', Validators.required],
      birthDate: ['', Validators.required],
      bloodGroup: [''],
      height: ['', Validators.required],
      weight: ['', Validators.required]
    });
  }

  carregarUsuario(): void {
    this.carregando = true;
    this.usuarioService.getUsuario(this.usuarioId).subscribe({
      next: (usuario: Usuario) => {
        console.log('Usuário carregado:', usuario);
        this.formulario.patchValue(usuario);
        this.carregando = false;
      },
      error: (erro: any) => {
        console.error('Erro ao carregar usuário:', erro);
        this.carregando = false;
      }
    });
  }

  salvar(): void {
    if (this.formulario.valid) {
      const dados = this.formulario.getRawValue();
      this.usuarioService.updateUsuario(this.usuarioId, dados).subscribe({
        next: (response: any) => {
          console.log('Usuário atualizado:', response);
          alert('Usuário atualizado com sucesso!');
          this.router.navigate(['/usuarios']);
        },
        error: (erro: any) => {
          console.error('Erro ao atualizar usuário:', erro);
          alert('Erro ao atualizar usuário!');
        }
      });
    } else {
      alert('Preencha todos os campos obrigatórios!');
    }
  }

  voltar(): void {
    this.router.navigate(['/usuarios']);
  }
}