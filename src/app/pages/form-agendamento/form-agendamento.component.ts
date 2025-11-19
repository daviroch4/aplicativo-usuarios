import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, AlertController } from '@ionic/angular';
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

  // Variáveis para exibição
  tipoAtendimentoTexto: string = 'Selecione o tipo';
  statusTexto: string = 'Futuro';

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
    private agendamentoService: AgendamentoService,
    private cdr: ChangeDetectorRef,
    private alertController: AlertController
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
          // Atualizar textos de exibição
          this.tipoAtendimentoTexto = agendamento.tipoAtendimento;
          this.statusTexto = this.getTextoStatus(agendamento.status);
        }
        this.carregando = false;
      },
      error: (erro) => {
        console.error('Erro ao carregar agendamento:', erro);
        this.carregando = false;
      }
    });
  }

  async abrirSeletorTipo() {
    const inputs = this.tiposAtendimento.map(tipo => ({
      type: 'radio' as const,
      label: tipo,
      value: tipo,
      checked: this.formulario.get('tipoAtendimento')?.value === tipo
    }));

    const alert = await this.alertController.create({
      header: 'Tipo de Atendimento',
      inputs: inputs,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'OK',
          handler: (valor) => {
            this.formulario.patchValue({ tipoAtendimento: valor });
            this.tipoAtendimentoTexto = valor;
            console.log('Tipo selecionado:', valor);
          }
        }
      ]
    });

    await alert.present();
  }

  async abrirSeletorStatus() {
    const alert = await this.alertController.create({
      header: 'Status',
      inputs: [
        {
          type: 'radio',
          label: 'Futuro',
          value: 'futuro',
          checked: this.formulario.get('status')?.value === 'futuro'
        },
        {
          type: 'radio',
          label: 'Atendido',
          value: 'atendido',
          checked: this.formulario.get('status')?.value === 'atendido'
        },
        {
          type: 'radio',
          label: 'Transferido',
          value: 'transferido',
          checked: this.formulario.get('status')?.value === 'transferido'
        },
        {
          type: 'radio',
          label: 'Cancelado',
          value: 'cancelado',
          checked: this.formulario.get('status')?.value === 'cancelado'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'OK',
          handler: (valor) => {
            this.formulario.patchValue({ status: valor });
            this.statusTexto = this.getTextoStatus(valor);
            console.log('Status selecionado:', valor);
          }
        }
      ]
    });

    await alert.present();
  }

  getTextoStatus(status: string): string {
    const textos: any = {
      'futuro': 'Futuro',
      'atendido': 'Atendido',
      'transferido': 'Transferido',
      'cancelado': 'Cancelado'
    };
    return textos[status] || 'Selecione o status';
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