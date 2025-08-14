<template>
  <v-app>
    <v-app-bar
      app
      flat
      class="gradient-bg toolbar"
      dark
    >
      <v-toolbar-title class="title-text">
        <v-icon left large color="#00bcd4">mdi-rocket-launch</v-icon>
        SpaceX Explorer
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn text to="/launches" class="v-btn">
        Launches
      </v-btn>
      <v-btn text to="/favorites" class="v-btn">
        Favorites
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container class="launches-container" fluid>
        <slot />
      </v-container>
    </v-main>

    <v-footer
      app
      padless
      class="gradient-bg toolbar footer-height"
      dark
    >
      <v-col
        class="text-center"
        cols="12"
      >
        <span style="color: #00bcd4; font-weight: 700;">
          &copy; 2025 SpaceX Explorer
        </span>
      </v-col>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: 'DefaultLayout',
}
</script>

<style scoped>
.gradient-bg {
  background: linear-gradient(135deg, #0f2027, #203a43, #2c5364) !important;
}

.footer-height {
  height: 60px !important;
}


.toolbar {
  box-shadow: none !important;
  margin-bottom: 32px;
}

.title-text {
  font-weight: 900;
  font-size: 2rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #00bcd4;
  user-select: none;
}

.v-btn {
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: background-color 0.3s ease;
}

.v-btn:hover {
  background-color: #00acc1 !important;
  color: #fff !important;
}
</style>
