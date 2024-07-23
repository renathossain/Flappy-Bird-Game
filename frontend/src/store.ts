import { writable } from 'svelte/store';

interface User {
  id: string;
  displayName: string;
  email: string;
  photo: string;
}

export const user = writable<User | null>(null);
export const registered = writable<boolean>(false);
