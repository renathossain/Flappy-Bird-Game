import { writable } from 'svelte/store';

interface User {
  id: string;
  displayName: string;
  email: string;
  familyName: string;
  givenName: string;
  photo: string;
  current_skin: number;
}
export const user = writable<User | null>(null);

const storedCode = localStorage.getItem('joinCode') || '';
export const codeStore = writable(storedCode);
codeStore.subscribe(value => {
  localStorage.setItem('joinCode', value);
});
