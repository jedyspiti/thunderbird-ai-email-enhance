document.addEventListener('DOMContentLoaded', async () => {
  const form = document.getElementById('optionsForm');
  const apiKeyInput = document.getElementById('apiKey');
  const statusMessage = document.getElementById('statusMessage');

  // Carrega a chave da API salva
  try {
    const result = await browser.storage.local.get('apiKey');
    if (result.apiKey) {
      apiKeyInput.value = result.apiKey;
    }
  } catch (error) {
    showStatus('Erro ao carregar configurações', false);
  }

  // Salva a chave da API
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const apiKey = apiKeyInput.value.trim();
    
    if (!apiKey) {
      showStatus('Por favor, insira uma chave de API válida', false);
      return;
    }

    try {
      await browser.storage.local.set({ apiKey });
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
