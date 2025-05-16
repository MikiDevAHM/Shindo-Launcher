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
  background: linear-gradient(135deg, #e0e7ff 0%, #f8fafc 100%);
  min-height: 100vh;
  margin: 0;
  overflow: hidden;
}

#app {
  font-family: "Segoe UI", Avenir, Helvetica, Arial, sans-serif;
  color: #22223b;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

#logo {
  width: 220px;
  height: 220px;
}

.status-label,
.launch-button {
  width: 440px;
  margin: 16px auto;
  padding: 18px 0;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.45);
  box-shadow: 0 4px 24px 0 rgba(31, 38, 135, 0.1);
  backdrop-filter: blur(6px);
  border: 1px solid rgba(255, 255, 255, 0.18);
}

* {
  user-select: none;
}

input,
textarea {
  user-select: text;
}
</style>
