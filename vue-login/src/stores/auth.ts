import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        isAuthenticated: false,
        user: null as string | null,
    }),
    actions: {
        async login(username: string, password: string) {
            return new Promise<boolean>((resolve) => {
                setTimeout(() => {
                    if (username && password) {
                        this.isAuthenticated = true;
                        this.user = username;
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                }, 2000);
            });
        },
        logout() {
            this.isAuthenticated = false;
            this.user = null;
        },
    },
});
