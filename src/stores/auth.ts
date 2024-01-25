import { defineStore } from 'pinia';
import type { SuccessfulNativeRegistration } from '@ory/client';
import { getDateFromISO } from 'src/utils/common';

type AuthDetail = {
  userId: string | undefined;
  sessionId: string | undefined;
  email: string | undefined;
  nickname: string | undefined;
  expiresAt: Date | undefined;
};

export const useAuthStore = defineStore('auth', {
  state: (): AuthDetail => ({
    userId: undefined,
    sessionId: undefined,
    email: undefined,
    nickname: undefined,
    expiresAt: undefined,
  }),
  getters: {
    getAuthDetail: (state): AuthDetail => state,
  },
  actions: {
    setAuthDetailFromRes(res: SuccessfulNativeRegistration) {
      this.userId = res.identity.id;
      this.email = res.identity.traits.email;
      this.nickname = res.identity.traits.nickname;
      if (res.session) {
        this.sessionId = res.session?.id;
        if (res.session.expires_at)
          this.expiresAt = getDateFromISO(res.session.expires_at);
      }
    },
  },
});
