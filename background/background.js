console.log('[background.js] Loading background script...');

// Configuração da API OpenAI
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const MODEL = 'gpt-4o-mini';

// Instruções para cada tipo de melhoria
const IMPROVEMENT_PROMPTS = {
  improve: 'Melhore a escrita do seguinte texto, mantendo o significado original mas tornando-o mais profissional e bem escrito:',
  clarify: 'Torne o seguinte texto mais claro e fácil de entender, mantendo as informações principais:',
  simplify: 'Simplifique o seguinte texto, mantendo apenas as informações essenciais:',
  friendly: 'Torne o seguinte texto mais amigável e cordial, mantendo o significado principal:',
  shorten: 'Encurte o seguinte texto, mantendo apenas as informações mais importantes:',
  expand: 'Expanda o seguinte texto, adicionando mais detalhes e explicações relevantes:'
};

// Função para obter a chave da API
async function getApiKey() {
  console.log('[background.js] Tentando obter API key do storage...');
  const result = await browser.storage.local.get('apiKey');
  if (!result.apiKey) {
    console.error('[background.js] API key não encontrada no storage');
    throw new Error('API key não configurada');
  }
  console.log('[background.js] API key obtida com sucesso');
  return result.apiKey;
}

// Função para processar o texto usando a OpenAI
async function processText(text, improvementType) {
  console.log('[background.js] Iniciando processamento de texto:', { improvementType });
  try {
    const apiKey = await getApiKey();
    const prompt = IMPROVEMENT_PROMPTS[improvementType];
    
    console.log('[background.js] Fazendo requisição para OpenAI API...');
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: 'system',
            content: 'Você é um assistente especializado em melhorar a escrita de emails profissionais em português.'
          },
          {
            role: 'user',
            content: `${prompt}\n\n${text}`
          }
        ],
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('[background.js] Erro na resposta da API:', error);
      throw new Error(error.error?.message || 'Erro ao processar o texto');
    }

    const data = await response.json();
    console.log('[background.js] Resposta da API recebida com sucesso');
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Erro ao processar texto:', error);
    throw error;
  }
}

// Listener para mensagens do content script
browser.runtime.onMessage.addListener(async (message, sender) => {
  console.log('[background.js] Mensagem recebida:', message);
  if (message.action === 'processText') {
    try {
      const improvedText = await processText(message.text, message.improvementType);
      return { success: true, text: improvedText };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
});
