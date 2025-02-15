# Thunderbird AI Email Enhance

Uma extensão para o Mozilla Thunderbird que utiliza a API da OpenAI para melhorar a escrita de emails.

## Funcionalidades

- Melhoria automática de texto usando IA
- Múltiplas opções de aprimoramento:
  - Melhorar a escrita
  - Tornar mais claro
  - Simplificar
  - Tornar mais amigável
  - Encurtar
  - Expandir
- Suporte para melhorar texto selecionado ou email completo
- Interface intuitiva com botão dropdown
- Preview das alterações antes de aplicar

## Instalação

1. Baixe o arquivo .xpi mais recente da seção de releases
2. Abra o Thunderbird
3. Vá em Ferramentas > Add-ons
4. Clique no ícone de engrenagem e selecione "Instalar add-on a partir de arquivo"
5. Selecione o arquivo .xpi baixado
6. Configure sua chave da API OpenAI nas opções da extensão

## Configuração

Após a instalação, você precisará configurar sua chave da API OpenAI:

1. Acesse as configurações da extensão
2. Insira sua chave da API OpenAI
3. Clique em Salvar

Você pode obter uma chave da API em: https://platform.openai.com/account/api-keys

## Como Usar

1. Ao compor um novo email, você verá um botão "Melhorar" na barra de ferramentas
2. Selecione o texto que deseja melhorar (opcional - se nenhum texto for selecionado, todo o email será processado)
3. Clique no botão e escolha o tipo de melhoria desejada
4. Revise as alterações sugeridas no modal
5. Clique em "Aplicar alterações" para aceitar ou "Cancelar" para manter o texto original

## Desenvolvimento

Para desenvolver a extensão:

1. Clone este repositório
2. Faça suas modificações
3. Teste a extensão no Thunderbird:
   - Vá em Ferramentas > Add-ons
   - Clique no ícone de engrenagem
   - Selecione "Debug Add-ons"
   - Clique em "Carregar Add-on Temporário"
   - Selecione o arquivo manifest.json do projeto

## Licença

Este projeto está licenciado sob a MIT License - veja o arquivo LICENSE para detalhes.
