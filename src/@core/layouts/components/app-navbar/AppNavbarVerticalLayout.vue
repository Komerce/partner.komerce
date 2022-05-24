<template>
  <div class="navbar-container d-flex content align-items-center">
    <!-- Nav Menu Toggler -->
    <ul class="nav navbar-nav">
      <li class="nav-item">
        <b-link
          class="nav-link"
          @click="toggleVerticalMenuActive"
        >
          <feather-icon
            icon="GridIcon"
            size="21"
          />
        </b-link>
      </li>
    </ul>

    <b-navbar-nav class="nav align-items-center mr-auto d-none d-lg-flex">
      <span class="brand-logo">
        <b-img
          :src="appLogoImage"
          alt="logo"
        />
      </span>
      <h2 class="brand-text">
        {{ appName }}
      </h2>
    </b-navbar-nav>

    <!-- Left Col -->
    <div class="bookmark-wrapper align-items-center flex-grow-1 d-none">
      <!-- Bookmarks Container -->
      <bookmarks />
    </div>

    <b-navbar-nav class="nav align-items-center ml-auto">
      <user-dropdown />
      <notification-dropdown v-if="false" />
    </b-navbar-nav>
  </div>
</template>

<script>
import {
  BLink, BNavbarNav, BImg,
} from 'bootstrap-vue'
import { $themeConfig } from '@themeConfig'
import Bookmarks from './components/Bookmarks.vue'
import NotificationDropdown from './components/NotificationDropdown.vue'
import UserDropdown from './components/UserDropdown.vue'

export default {
  components: {
    BLink,
    BImg,

    // Navbar Components
    BNavbarNav,
    Bookmarks,
    NotificationDropdown,
    UserDropdown,
  },
  props: {
    toggleVerticalMenuActive: {
      type: Function,
      default: () => {},
    },
  },
  setup() {
    // App Name
    const { appName, appLogoImage } = $themeConfig.app

    return {
      // App Name
      appName,
      appLogoImage,
    }
  },
}
</script>
