import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AgendamentoService } from 'src/app/services/agendamento.service';
import { Agendamento } from 'src/app/models/agendamento.model';

@Component({
  selector: 'app-form-agendamento',
  templateUrl: './form-agendamento.component.html',
  styleUrls: ['./form-agendamento.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule, ReactiveFormsModule]
})
export class FormAgendamentoComponent implements OnInit {
  formulario!: FormGroup;
  agendamentoId?: number;
  carregando: boolean = false;
  modoEdicao: boolean = false;

  tiposAtendimento = [
    'Avaliação Inicial',
    'Fisioterapia Ortopédica',
    'Fisioterapia Neurológica',
    'Fisioterapia Respiratória',
    'Fisioterapia Geriátrica',
    'RPG',
    'Pilates Terapêutico',
    'Drenagem Linfática',
    'Outro'
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private agendamentoService: AgendamentoService
  ) { }

  ngOnInit() {
    this.criarFormulario();
    
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.agendamentoId = Number(id);
      this.modoEdicao = true;
      this.carregarAgendamento();
    }
  }

  criarFormulario(): void {
  this.formulario = this.fb.group({
    pacienteNome: ['', Validators.required],
    pacienteTelefone: ['', Validators.required],
    pacienteRua: ['', Validators.required],
    pacienteBairro: ['', Validators.required],
    pacienteCidade: ['', Validators.required],
    dataAtendimento: ['', Validators.required],
    horaAtendimento: ['', Validators.required],
    tipoAtendimento: ['', Validators.required],
    observacoes: [''],
    status: ['futuro', Validators.required]
  });
}

  carregarAgendamento(): void {
    if (!this.agendamentoId) return;

    this.carregando = true;
    this.agendamentoService.getAgendamento(this.agendamentoId).subscribe({
      next: (agendamento) => {
        if (agendamento) {
          this.formulario.patchValue(agendamento);
        }
        this.carregando = false;
      },
      error: (erro) => {
        console.error('Erro ao carregar agendamento:', erro);
        this.carregando = false;
      }
    });
  }

  onTipoAtendimentoChange(event: any): void {
  const valor = event.detail.value;
  this.formulario.patchValue({
    tipoAtendimento: valor
  });
  this.formulario.get('tipoAtendimento')?.markAsDirty();
  console.log('Tipo atendimento alterado para:', valor);
}

onStatusChange(event: any): void {
  const valor = event.detail.value;
  this.formulario.patchValue({
    status: valor
  });
  this.formulario.get('status')?.markAsDirty();
  console.log('Status alterado para:', valor);
}

  salvar(): void {
    if (this.formulario.invalid) {
      alert('Preencha todos os campos obrigatórios!');
      return;
    }

    const dados = this.formulario.value;

    if (this.modoEdicao && this.agendamentoId) {
      // Atualizar
      this.agendamentoService.atualizarAgendamento(this.agendamentoId, dados).subscribe({
        next: () => {
          alert('Agendamento atualizado com sucesso!');
          this.router.navigate(['/agendamentos']);
        },
        error: (erro) => {
          console.error('Erro ao atualizar:', erro);
          alert('Erro ao atualizar agendamento!');
        }
      });
    } else {
      // Criar novo
      this.agendamentoService.criarAgendamento(dados).subscribe({
        next: () => {
          alert('Agendamento criado com sucesso!');
          this.router.navigate(['/agendamentos']);
        },
        error: (erro) => {
          console.error('Erro ao criar:', erro);
          alert('Erro ao criar agendamento!');
        }
      });
    }
  }

  voltar(): void {
    this.router.navigate(['/agendamentos']);
  }
}