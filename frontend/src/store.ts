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

const storedCode = sessionStorage.getItem('joinCode');
export const code = writable<number | null>(storedCode ? Number(storedCode) : null);

code.subscribe(value => {
  sessionStorage.setItem('joinCode', value !== null ? value.toString() : '');
});

const storedHost = sessionStorage.getItem('hostCode');
export const host = writable<number | null>(storedHost ? Number(storedHost) : null);

host.subscribe(value => {
  sessionStorage.setItem('hostCode', value !== null ? value.toString() : '');
});