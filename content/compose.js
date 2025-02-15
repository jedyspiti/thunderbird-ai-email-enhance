console.log('[compose.js] Loading compose script...');

// Ícone SVG para o botão
const ENHANCE_ICON = `
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
</svg>
`;

// Opções de melhoria
const ENHANCEMENT_OPTIONS = [
  { id: 'improve', label: 'Melhorar a escrita' },
  { id: 'clarify', label: 'Tornar mais claro' },
  { id: 'simplify', label: 'Simplificar' },
  { id: 'friendly', label: 'Tornar mais amigável' },
  { id: 'shorten', label: 'Encurtar' },
  { id: 'expand', label: 'Expandir' }
];

function createButton() {
  console.log('[compose.js] Criando botão de melhoria...');
  const button = document.createElement('button');
  button.className = 'ai-enhance-button';
  button.innerHTML = ENHANCE_ICON + ' Melhorar';
  
  const menu = document.createElement('div');
  menu.className = 'ai-enhance-menu';

  // Adicionar opções ao menu
  ENHANCEMENT_OPTIONS.forEach(option => {
    const item = document.createElement('div');
    item.className = 'ai-enhance-menu-item';
    item.textContent = option.label;
    item.onclick = () => handleEnhancement(option.id);
    menu.appendChild(item);
  });

  const dropdown = document.createElement('div');
  dropdown.className = 'ai-enhance-dropdown';
  dropdown.appendChild(button);
  dropdown.appendChild(menu);

  button.onclick = () => {
    console.log('[compose.js] Botão clicado - toggleando menu');
    menu.classList.toggle('show');
  };

  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target)) {
      menu.classList.remove('show');
    }
  });

  return dropdown;
}

async function handleEnhancement(type) {
  console.log('[compose.js] Iniciando melhoria do tipo:', type);
  const editor = await messenger.compose.getActiveEditor();
  const text = editor.selection || editor.getText();
  console.log('[compose.js] Texto obtido:', text ? 'Sim' : 'Não');

  if (!text) {
    alert('Nenhum texto selecionado ou disponível para melhorar.');
    return;
  }

  try {
    console.log('[compose.js] Enviando texto para processamento...');
    const button = document.querySelector('.ai-enhance-button');
    button.innerHTML = '<span class="ai-enhance-loading"></span> Processando...';

    console.log('[compose.js] Enviando mensagem para background script...');
    const response = await messenger.runtime.sendMessage({
      action: 'processText',
      text,
      improvementType: type
    });

    if (!response.success) {
      console.error('[compose.js] Erro na resposta:', response.error);
      throw new Error(response.error);
    }
    console.log('[compose.js] Texto processado com sucesso');

    showConfirmationModal(response.text, text, editor);
  } catch (error) {
    alert(error.message);
  } finally {
    const button = document.querySelector('.ai-enhance-button');
    button.innerHTML = ENHANCE_ICON + ' Melhorar';
  }
}

function showConfirmationModal(newText, originalText, editor) {
  const modal = document.createElement('div');
  modal.className = 'ai-enhance-modal-overlay';
  modal.innerHTML = `
    <div class="ai-enhance-modal">
      <div class="ai-enhance-modal-header">
        <h2 class="ai-enhance-modal-title">Confirmar alterações</h2>
      </div>
      <div class="ai-enhance-modal-content">${newText}</div>
      <div class="ai-enhance-modal-actions">
        <button class="ai-enhance-modal-button secondary">Cancelar</button>
        <button class="ai-enhance-modal-button primary">Aplicar alterações</button>
      </div>
    </div>
  `;

  const cancelButton = modal.querySelector('.secondary');
  const confirmButton = modal.querySelector('.primary');

  cancelButton.onclick = () => {
    document.body.removeChild(modal);
  };

  confirmButton.onclick = () => {
    if (editor.selection) {
      editor.replaceSelection(newText);
    } else {
      editor.setText(newText);
    }
    document.body.removeChild(modal);
  };

  document.body.appendChild(modal);
}

// Adicionar botão quando a janela de composição estiver pronta
document.addEventListener('compose-window-init', () => {
  console.log('[compose.js] Evento compose-window-init disparado');
  const toolbar = document.querySelector('toolbar[type="composeToolbar"]');
  console.log('[compose.js] Toolbar encontrada:', toolbar ? 'Sim' : 'Não');
  if (toolbar) {
    toolbar.appendChild(createButton());
    console.log('[compose.js] Botão adicionado à toolbar');
  } else {
    console.error('[compose.js] Toolbar não encontrada');
  }
});
