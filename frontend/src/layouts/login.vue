<route lang="yaml">
meta:
  layout: login
</route>

  
  <template>
  <v-app>
    <v-main>
      <v-container class="fill-height">
        <v-responsive class="d-flex align-center text-center fill-height">
          <router-view />
        </v-responsive>
      </v-container>
    </v-main>
  </v-app>
</template>