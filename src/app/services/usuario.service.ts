import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { Usuario, UsuariosResponse } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = 'https://dummyjson.com/users';
  private storageKey = 'usuarios_locais';

  constructor(private http: HttpClient) { }

  // Buscar usuários (primeiro tenta local, senão busca da API)
  getUsuarios(): Observable<UsuariosResponse> {
    const usuariosLocais = this.getUsuariosLocal();
    
    if (usuariosLocais && usuariosLocais.length > 0) {
      console.log('Carregando usuários do armazenamento local');
      return of({
        users: usuariosLocais,
        total: usuariosLocais.length,
        skip: 0,
        limit: usuariosLocais.length
      });
    }

    console.log('Carregando usuários da API');
    return this.http.get<UsuariosResponse>(this.apiUrl).pipe(
      tap(response => {
        this.salvarUsuariosLocal(response.users);
      })
    );
  }

  // Buscar um usuário específico
  getUsuario(id: number): Observable<Usuario> {
    const usuariosLocais = this.getUsuariosLocal();
    const usuarioLocal = usuariosLocais.find(u => u.id === id);

    if (usuarioLocal) {
      console.log('Carregando usuário do armazenamento local');
      return of(usuarioLocal);
    }

    console.log('Carregando usuário da API');
    return this.http.get<Usuario>(`${this.apiUrl}/${id}`);
  }

  // Atualizar usuário
  updateUsuario(id: number, usuario: Partial<Usuario>): Observable<Usuario> {
    const usuariosLocais = this.getUsuariosLocal();
    const index = usuariosLocais.findIndex(u => u.id === id);

    if (index !== -1) {
      usuariosLocais[index] = { ...usuariosLocais[index], ...usuario };
      this.salvarUsuariosLocal(usuariosLocais);
      console.log('Usuário atualizado no armazenamento local');
      return of(usuariosLocais[index]);
    }

    return this.http.put<Usuario>(`${this.apiUrl}/${id}`, usuario).pipe(
      tap(usuarioAtualizado => {
        usuariosLocais.push(usuarioAtualizado);
        this.salvarUsuariosLocal(usuariosLocais);
      })
    );
  }

  // Salvar usuários no localStorage
  private salvarUsuariosLocal(usuarios: Usuario[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(usuarios));
  }

  // Buscar usuários do localStorage
  private getUsuariosLocal(): Usuario[] {
    const dados = localStorage.getItem(this.storageKey);
    return dados ? JSON.parse(dados) : [];
  }

  // Limpar cache local (útil para testes)
  limparCacheLocal(): void {
    localStorage.removeItem(this.storageKey);
    console.log('Cache local limpo');
  }
}