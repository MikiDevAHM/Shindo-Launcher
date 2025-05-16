<template>
  <div id="app">
    <img id="logo" alt="Logo" src="./assets/logo.png" />
    <StatusLabel :msg="statusMessage" />
    <LaunchButton :disabled="isLoading" @launch="handleLaunch" />
  </div>
</template>

<script>
import StatusLabel from './components/StatusLabel.vue';
import LaunchButton from './components/LaunchButton.vue';
const { ipcRenderer } = window.require('electron');
export default {
    components: {
    StatusLabel,
    LaunchButton
  },
  data() {
    return {
      statusMessage: 'Verificando atualizações...',
      isLoading: true,
      logs: []
    };
  },
   methods: {
    async runUpdater() {
       this.isLoading = true;  // bloqueia botão enquanto atualiza
      console.log('✅ Chamando runUpdater...');
      this.statusMessage = 'Executando atualizador...';
      this.logs = [];

      ipcRenderer.on('updater-log', (event, msg) => {
        this.logs.push(msg);
        console.log('Updater log:', msg);
      });

      try {
        const exitCode = await ipcRenderer.invoke('run-updater')
        console.log('Updater finalizado com código:', exitCode)
      } catch (error) {
        console.error('Erro no updater:', error)
        this.statusMessage = 'Falha ao executar o updater.'
      } finally {
        this.isLoading = false
        this.statusMessage = 'Tudo esta Atualizado!'
        ipcRenderer.removeAllListeners('updater-log')
      }
    },
    handleLaunch() {
      this.statusMessage = 'Iniciando Minecraft ...';
      ipcRenderer.invoke('launch-client');
      this.statusMessage = 'Minecraft Iniciado ...';
    }
  },
  mounted() {
    console.log('[Vue] Chamando runUpdater');
    this.runUpdater();
  }
};
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

body {
  background-color: whitesmoke;
  background-blend-mode: luminosity;
  overflow: hidden;
}

#logo {
  width: 40%;
  height: 40%;
}

* {
  user-select: none;
}

input,
textarea {
  user-select: text;
}
</style>
