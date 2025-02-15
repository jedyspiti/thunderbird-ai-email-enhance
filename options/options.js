console.log('[options.js] Loading options page...');

document.addEventListener('DOMContentLoaded', async () => {
  console.log('[options.js] DOM carregado, inicializando...');
  const form = document.getElementById('optionsForm');
  const apiKeyInput = document.getElementById('apiKey');
  const statusMessage = document.getElementById('statusMessage');

  // Carrega a chave da API salva
  try {
    console.log('[options.js] Tentando carregar API key do storage...');
    const result = await browser.storage.local.get('apiKey');
    if (result.apiKey) {
      console.log('[options.js] API key encontrada no storage');
      apiKeyInput.value = result.apiKey;
    } else {
      console.log('[options.js] Nenhuma API key encontrada no storage');
    }
  } catch (error) {
    showStatus('Erro ao carregar configurações', false);
  }

  // Salva a chave da API
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log('[options.js] Formulário submetido');
    
    const apiKey = apiKeyInput.value.trim();
    
    if (!apiKey) {
      showStatus('Por favor, insira uma chave de API válida', false);
      return;
    }

    try {
      console.log('[options.js] Salvando nova API key no storage...');
      await browser.storage.local.set({ apiKey });
      console.log('[options.js] API key salva com sucesso');
      showStatus('Configurações salvas com sucesso!', true);
    } catch (error) {
      showStatus('Erro ao salvar configurações', false);
    }
  });

  function showStatus(message, isSuccess) {
    statusMessage.textContent = message;
    statusMessage.className = `status ${isSuccess ? 'success' : 'error'}`;
    statusMessage.style.display = 'block';

    setTimeout(() => {
      statusMessage.style.display = 'none';
    }, 3000);
  }
});
