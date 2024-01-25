<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-grey-7" elevated>
      <q-toolbar class="q-py-sm">
        <q-btn
          aria-label="Menu"
          dense
          flat
          icon="menu"
          round
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title> Quasar App </q-toolbar-title>

        <q-btn dense flat icon="sym_o_account_circle" round size="lg">
          <q-popup-proxy>
            <q-card class="bg-grey-9" style="width: 240px">
              <q-card-section class="row justify-center">
                <div class="text-grey-3" style="font-size: 16px">
                  {{ userDetail.email }}
                </div>
              </q-card-section>

              <q-card-section class="row justify-center">
                <q-avatar
                  color="grey-3"
                  font-size="120px"
                  icon="account_circle"
                  size="124px"
                />
              </q-card-section>

              <q-card-section class="row justify-center">
                <div class="text-grey-3" style="font-size: 24px">
                  {{ $t('auth.greeting', { name: userDetail.nickname }) }}
                </div>
              </q-card-section>

              <q-card-section class="row justify-center">
                <q-btn
                  class="q-pa-md"
                  flat
                  icon="sym_o_logout"
                  :label="$t('auth.logout')"
                  :loading="loading"
                  no-caps
                  rounded
                  text-color="grey-3"
                  @click="logout"
                />
              </q-card-section>
            </q-card>
          </q-popup-proxy>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" bordered show-if-above>
      <q-list>
        <q-item-label header> Essential Links </q-item-label>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import EssentialLink, {
  EssentialLinkProps,
} from 'components/EssentialLink.vue';
import { useAuthStore } from 'src/stores/auth';
import { createLogout } from 'src/utils/ory';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { api } from 'src/boot/axios';

const essentialLinks: EssentialLinkProps[] = [
  {
    title: 'Docs',
    caption: 'quasar.dev',
    icon: 'school',
    link: 'https://quasar.dev',
  },
  {
    title: 'Github',
    caption: 'github.com/quasarframework',
    icon: 'code',
    link: 'https://github.com/quasarframework',
  },
  {
    title: 'Discord Chat Channel',
    caption: 'chat.quasar.dev',
    icon: 'chat',
    link: 'https://chat.quasar.dev',
  },
  {
    title: 'Forum',
    caption: 'forum.quasar.dev',
    icon: 'record_voice_over',
    link: 'https://forum.quasar.dev',
  },
  {
    title: 'Twitter',
    caption: '@quasarframework',
    icon: 'rss_feed',
    link: 'https://twitter.quasar.dev',
  },
  {
    title: 'Facebook',
    caption: '@QuasarFramework',
    icon: 'public',
    link: 'https://facebook.quasar.dev',
  },
  {
    title: 'Quasar Awesome',
    caption: 'Community Quasar projects',
    icon: 'favorite',
    link: 'https://awesome.quasar.dev',
  },
];

const authStore = useAuthStore();
const $q = useQuasar();
const { t: $t } = useI18n();
const router = useRouter();

const userDetail = computed(() => authStore.getAuthDetail);
const loading = ref(false);

const leftDrawerOpen = ref(false);

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};

const logout = async () => {
  loading.value = true;
  try {
    const logoutFlowRes = await createLogout();
    const res = await api.get(`${process.env.API_URL}/self-service/logout`, {
      params: { token: logoutFlowRes.logout_token },
      headers: {
        'Content-Type': 'applicaton/json',
        Accept: 'application/json',
      },
    });
    if (res.status === 204) {
      authStore.reset();
      $q.notify({ message: $t('auth.logout_succeed'), type: 'info' });
      router.push({ name: 'login' });
    }
  } finally {
    loading.value = false;
  }
};
</script>
