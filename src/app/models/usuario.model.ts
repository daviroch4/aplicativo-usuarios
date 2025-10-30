export interface Usuario {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  birthDate: string;
  bloodGroup: string;
  height: number;
  weight: number;
  image: string;
}

export interface UsuariosResponse {
  users: Usuario[];
  total: number;
  skip: number;
  limit: number;
}