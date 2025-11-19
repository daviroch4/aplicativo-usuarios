import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Agendamento } from '../models/agendamento.model';

@Injectable({
  providedIn: 'root'
})
export class AgendamentoService {
  private storageKey = 'agendamentos_fisioterapia';
  private proximoId = 1;

  constructor() {
    this.inicializarProximoId();
  }

  // Inicializar o próximo ID baseado nos agendamentos existentes
  private inicializarProximoId(): void {
    const agendamentos = this.getAgendamentosLocal();
    if (agendamentos.length > 0) {
      const maiorId = Math.max(...agendamentos.map(a => a.id));
      this.proximoId = maiorId + 1;
    }
  }

  // Listar todos os agendamentos
  getAgendamentos(): Observable<Agendamento[]> {
    return of(this.getAgendamentosLocal());
  }

  // Buscar agendamento por ID
  getAgendamento(id: number): Observable<Agendamento | undefined> {
    const agendamentos = this.getAgendamentosLocal();
    const agendamento = agendamentos.find(a => a.id === id);
    return of(agendamento);
  }

  // Criar novo agendamento
  criarAgendamento(agendamento: Omit<Agendamento, 'id' | 'criadoEm' | 'atualizadoEm'>): Observable<Agendamento> {
    const agendamentos = this.getAgendamentosLocal();
    const novoAgendamento: Agendamento = {
      ...agendamento,
      id: this.proximoId++,
      criadoEm: new Date().toISOString(),
      atualizadoEm: new Date().toISOString()
    };
    
    agendamentos.push(novoAgendamento);
    this.salvarAgendamentosLocal(agendamentos);
    return of(novoAgendamento);
  }

  // Atualizar agendamento
  atualizarAgendamento(id: number, dados: Partial<Agendamento>): Observable<Agendamento | null> {
    const agendamentos = this.getAgendamentosLocal();
    const index = agendamentos.findIndex(a => a.id === id);

    if (index !== -1) {
      agendamentos[index] = {
        ...agendamentos[index],
        ...dados,
        atualizadoEm: new Date().toISOString()
      };
      this.salvarAgendamentosLocal(agendamentos);
      return of(agendamentos[index]);
    }

    return of(null);
  }

  // Atualizar status do agendamento
  atualizarStatus(id: number, status: Agendamento['status']): Observable<Agendamento | null> {
    return this.atualizarAgendamento(id, { status });
  }

  // Deletar agendamento
  deletarAgendamento(id: number): Observable<boolean> {
    const agendamentos = this.getAgendamentosLocal();
    const agendamentosFiltrados = agendamentos.filter(a => a.id !== id);
    
    if (agendamentos.length !== agendamentosFiltrados.length) {
      this.salvarAgendamentosLocal(agendamentosFiltrados);
      return of(true);
    }
    
    return of(false);
  }

  // Filtrar agendamentos por status
  getAgendamentosPorStatus(status: Agendamento['status']): Observable<Agendamento[]> {
    const agendamentos = this.getAgendamentosLocal();
    return of(agendamentos.filter(a => a.status === status));
  }

  // Salvar no localStorage
  private salvarAgendamentosLocal(agendamentos: Agendamento[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(agendamentos));
  }

  // Buscar do localStorage
  private getAgendamentosLocal(): Agendamento[] {
    const dados = localStorage.getItem(this.storageKey);
    return dados ? JSON.parse(dados) : [];
  }

  // Limpar cache
  limparCache(): void {
    localStorage.removeItem(this.storageKey);
    this.proximoId = 1;
  }
}