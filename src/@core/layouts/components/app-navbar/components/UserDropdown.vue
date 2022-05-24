<template>
  <b-nav-item-dropdown
    right
    toggle-class="d-flex align-items-center dropdown-user-link"
    class="dropdown-user"
  >
    <template #button-content>
      <div class="d-sm-flex d-none user-nav">
        <p class="user-name font-weight-bolder mb-0 color-dark">
          {{ greetingsTime }} {{ $store.state.auth.userData.full_name || $store.state.auth.userData.username }}
        </p>
        <span class="user-status">{{ $store.state.auth.userData.role }}</span>
      </div>
      <b-avatar
        size="40"
        :src="$store.state.auth.userData.photo_profile_url"
        variant="light-primary"
        badge
        class="badge-minimal"
        badge-variant="success"
      >
        <feather-icon
          v-if="!$store.state.auth.userData.photo_profile_url"
          icon="UserIcon"
          size="22"
        />
      </b-avatar>
    </template>

    <!-- <b-dropdown-item
      v-if="profileRoute"
      link-class="d-flex align-items-center"
      :to="{ name: profileRoute }"
    >
      <feather-icon
        size="16"
        icon="UserIcon"
        class="mr-50"
      />
      <span>Profile</span>
    </b-dropdown-item> -->
    <b-dropdown-item
      link-class="d-flex align-items-center"
      @click="skin = isDark ? 'light' : 'dark'"
    >
      <feather-icon
        size="16"
        :icon="`${isDark ? 'Sun' : 'Moon'}Icon`"
        class="mr-50"
      />
      <span>{{ isDark ? 'Light' : 'Dark' }} Mode</span>
    </b-dropdown-item>
    <b-dropdown-divider />
    <b-dropdown-item
      link-class="d-flex align-items-center"
      @click="logout"
    >
      <feather-icon
        size="16"
        icon="LogOutIcon"
        class="mr-50"
      />
      <span>Logout</span>
    </b-dropdown-item>
  </b-nav-item-dropdown>
</template>

<script>
import {
  BNavItemDropdown, BDropdownItem, BDropdownDivider, BAvatar,
} from 'bootstrap-vue'
import { initialAbility } from '@/libs/acl/config'
import { avatarText } from '@core/utils/filter'
import useAppConfig from '@core/app-config/useAppConfig'
import { computed } from '@vue/composition-api'
import { isUserLoggedIn } from '@/auth/utils'

export default {
  components: {
    BNavItemDropdown,
    BDropdownItem,
    BDropdownDivider,
    BAvatar,
  },
  data() {
    return {
      avatarText,
    }
  },
  setup() {
    const { skin } = useAppConfig()

    const isDark = computed(() => skin.value === 'dark')

    return { skin, isDark }
  },
  computed: {
    isAdmin() {
      return isUserLoggedIn() && this.$store.state.auth?.userData?.role_name?.toUpperCase() === 'ADMIN'
    },
    profileRoute() {
      if (!isUserLoggedIn()) return ''
      if (this.$store.state.auth?.userData?.role_name?.toUpperCase() === 'SDM') return 'talent-profile'
      if (this.$store.state.auth?.userData?.role_name?.toUpperCase() === 'PARTNER') return 'partner-profile'
      return ''
    },
    greetingsTime() {
      const date = new Date()
      let dateChange = null
      let str = ''
      if ((date.getUTCHours() - date.getHours()) !== 0) {
        dateChange = date.getHours()
      } else {
        dateChange = (8 + date.getHours())
      }

      if (dateChange < 4) {
        str = 'Selamat Malam,'
      } else if (dateChange < 11) {
        str = 'Selamat Pagi,'
      } else if (dateChange < 16) {
        str = 'Selamat Siang,'
      } else if (dateChange < 20) {
        str = 'Selamat Sore,'
      } else {
        str = 'Selamat Malam,'
      }
      return str
    },
  },
  methods: {
    logout() {
      localStorage.clear()
      // Reset ability
      this.$ability.update(initialAbility)

      // Redirect to login page
      this.$router.push({ name: 'auth-login' })
    },
  },
}
</script>
