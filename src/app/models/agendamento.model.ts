export interface Agendamento {
  id: number;
  pacienteNome: string;
  pacienteTelefone: string;
  pacienteRua: string;
  pacienteBairro: string;
  pacienteCidade: string;
  dataAtendimento: string;
  horaAtendimento: string;
  tipoAtendimento: string;
  observacoes?: string;
  status: 'futuro' | 'atendido' | 'transferido' | 'cancelado';
  criadoEm: string;
  atualizadoEm: string;
}