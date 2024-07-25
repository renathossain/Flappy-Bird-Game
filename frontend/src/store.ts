import { writable } from 'svelte/store';

export interface User {
  id: string;
  displayName: string;
  email: string;
  familyName: string;
  givenName: string;
  photo: string;
  currentSkin: number;
}
export const user = writable<User | null>(null);

const storedCode = localStorage.getItem('joinCode');
export const code = writable<number | null>(storedCode ? Number(storedCode) : null);

code.subscribe(value => {
  localStorage.setItem('joinCode', value !== null ? value.toString() : '');
});