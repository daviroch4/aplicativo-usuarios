import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { AgendamentoService } from 'src/app/services/agendamento.service';
import { Agendamento } from 'src/app/models/agendamento.model';

@Component({
  selector: 'app-lista-agendamentos',
  templateUrl: './lista-agendamentos.component.html',
  styleUrls: ['./lista-agendamentos.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class ListaAgendamentosComponent implements OnInit {
  agendamentos: Agendamento[] = [];
  agendamentosFiltrados: Agendamento[] = [];
  filtroStatus: string = 'todos';
  carregando: boolean = false;

  constructor(
    private agendamentoService: AgendamentoService,
    private router: Router
  ) { }

  ngOnInit() {
    this.carregarAgendamentos();
  }

  ionViewWillEnter() {
  this.carregarAgendamentos();
}

  carregarAgendamentos(): void {
    this.carregando = true;
    this.agendamentoService.getAgendamentos().subscribe({
      next: (agendamentos) => {
        this.agendamentos = agendamentos;
        this.aplicarFiltro();
        this.carregando = false;
      },
      error: (erro) => {
        console.error('Erro ao carregar agendamentos:', erro);
        this.carregando = false;
      }
    });
  }

  aplicarFiltro(): void {
    if (this.filtroStatus === 'todos') {
      this.agendamentosFiltrados = this.agendamentos;
    } else {
      this.agendamentosFiltrados = this.agendamentos.filter(
        a => a.status === this.filtroStatus
      );
    }
  }

  getEnderecoCompleto(agendamento: Agendamento): string {
  return `${agendamento.pacienteRua}, ${agendamento.pacienteBairro} - ${agendamento.pacienteCidade}`;
}

  filtrarPorStatus(status: string): void {
    this.filtroStatus = status;
    this.aplicarFiltro();
  }

  novoAgendamento(): void {
    this.router.navigate(['/agendamentos/novo']);
  }

  editarAgendamento(id: number): void {
    this.router.navigate(['/agendamentos/editar', id]);
  }

  atualizarStatus(id: number, status: Agendamento['status']): void {
    this.agendamentoService.atualizarStatus(id, status).subscribe({
      next: () => {
        this.carregarAgendamentos();
      },
      error: (erro) => {
        console.error('Erro ao atualizar status:', erro);
      }
    });
  }

  deletarAgendamento(id: number): void {
    if (confirm('Tem certeza que deseja deletar este agendamento?')) {
      this.agendamentoService.deletarAgendamento(id).subscribe({
        next: () => {
          this.carregarAgendamentos();
        },
        error: (erro) => {
          console.error('Erro ao deletar agendamento:', erro);
        }
      });
    }
  }

  formatarData(data: string): string {
    const date = new Date(data);
    const dia = String(date.getDate()).padStart(2, '0');
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const ano = date.getFullYear();
    return `${dia}/${mes}/${ano}`;
  }

  getCorStatus(status: string): string {
    const cores: any = {
      'futuro': 'primary',
      'atendido': 'success',
      'transferido': 'warning',
      'cancelado': 'danger'
    };
    return cores[status] || 'medium';
  }

  getTextoStatus(status: string): string {
    const textos: any = {
      'futuro': 'Futuro',
      'atendido': 'Atendido',
      'transferido': 'Transferido',
      'cancelado': 'Cancelado'
    };
    return textos[status] || status;
  }
}