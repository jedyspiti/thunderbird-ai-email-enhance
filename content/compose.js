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

class AIEnhanceButton {
  constructor() {
    this.isProcessing = false;
    this.init();
  }

  init() {
    // Criar o botão dropdown
    this.createDropdown();
    
    // Adicionar listeners
    document.addEventListener('click', (e) => {
      if (!this.dropdown.contains(e.target)) {
        this.hideMenu();
      }
    });
  }

  createDropdown() {
    this.dropdown = document.createElement('div');
    this.dropdown.className = 'ai-enhance-dropdown';

    // Botão principal
    const button = document.createElement('button');
    button.className = 'ai-enhance-button';
    button.innerHTML = ENHANCE_ICON + ' Melhorar';
    button.onclick = () => this.toggleMenu();

    // Menu dropdown
    const menu = document.createElement('div');
    menu.className = 'ai-enhance-menu';

    // Adicionar opções ao menu
    ENHANCEMENT_OPTIONS.forEach(option => {
      const item = document.createElement('div');
      item.className = 'ai-enhance-menu-item';
      item.textContent = option.label;
      item.onclick = () => this.handleEnhancement(option.id);
      menu.appendChild(item);
    });

    this.dropdown.appendChild(button);
    this.dropdown.appendChild(menu);
    this.menu = menu;

    // Adicionar à barra de ferramentas
    this.addToToolbar();
  }

  addToToolbar() {
    // Encontrar a barra de ferramentas do editor
    const interval = setInterval(() => {
      const toolbar = document.querySelector('.editor-toolbar');
      if (toolbar) {
        clearInterval(interval);
        toolbar.appendChild(this.dropdown);
      }
    }, 1000);
  }

  toggleMenu() {
    const isVisible = this.menu.classList.contains('show');
    if (isVisible) {
      this.hideMenu();
    } else {
      this.showMenu();
    }
  }

  showMenu() {
    this.menu.classList.add('show');
  }

  hideMenu() {
    this.menu.classList.remove('show');
  }

  async handleEnhancement(type) {
    if (this.isProcessing) return;
    
    this.hideMenu();
    
    // Obter o texto selecionado ou todo o conteúdo
    const editor = document.querySelector('.content-iframe');
    if (!editor) return;

    const editorDocument = editor.contentDocument;
    const selection = editorDocument.getSelection();
    const text = selection.toString().trim() || editorDocument.body.innerText.trim();

    if (!text) {
      this.showError('Nenhum texto selecionado ou disponível para melhorar.');
      return;
    }

    try {
      this.isProcessing = true;
      this.showLoadingState();

      // Enviar texto para processamento
      const response = await browser.runtime.sendMessage({
        action: 'processText',
        text,
        improvementType: type
      });

      if (!response.success) {
        throw new Error(response.error);
      }

      // Mostrar modal de confirmação
      this.showConfirmationModal(response.text, text, selection);
    } catch (error) {
      this.showError(error.message);
    } finally {
      this.isProcessing = false;
      this.hideLoadingState();
    }
  }

  showLoadingState() {
    const button = this.dropdown.querySelector('.ai-enhance-button');
    button.innerHTML = '<span class="ai-enhance-loading"></span> Processando...';
  }

  hideLoadingState() {
    const button = this.dropdown.querySelector('.ai-enhance-button');
    button.innerHTML = ENHANCE_ICON + ' Melhorar';
  }

  showError(message) {
    // TODO: Implementar um toast ou notificação mais elegante
    alert(message);
  }

  showConfirmationModal(newText, originalText, selection) {
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

    // Adicionar handlers
    const cancelButton = modal.querySelector('.secondary');
    const confirmButton = modal.querySelector('.primary');

    cancelButton.onclick = () => {
      document.body.removeChild(modal);
    };

    confirmButton.onclick = () => {
      this.applyChanges(newText, selection);
      document.body.removeChild(modal);
    };

    document.body.appendChild(modal);
  }

  applyChanges(newText, selection) {
    const editor = document.querySelector('.content-iframe');
    if (!editor) return;

    const editorDocument = editor.contentDocument;
    
    if (selection && !selection.isCollapsed) {
      // Se houver seleção, substituir apenas o texto selecionado
      const range = selection.getRangeAt(0);
      range.deleteContents();
      range.insertNode(editorDocument.createTextNode(newText));
    } else {
      // Se não houver seleção, substituir todo o conteúdo
      editorDocument.body.innerHTML = newText;
    }
  }
}

// Inicializar quando o documento estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  new AIEnhanceButton();
});
