/**
 * Code.gs — Endpoint de captura de leads (Race Experience / Fast Laps)
 *
 * Este script roda vinculado a uma planilha Google Sheets (Extensões > Apps Script)
 * e funciona como um "banco de dados" simples via Web App, enquanto não existe
 * um CRM/backend próprio. O site chama este endpoint via fetch (POST) e cada
 * envio de formulário vira uma nova linha na aba de leads.
 *
 * Veja SETUP.md para o passo a passo completo de configuração e deploy.
 */

// TODO: cole aqui o ID da planilha (está na URL entre /d/ e /edit)
// Exemplo de URL: https://docs.google.com/spreadsheets/d/ESSE_TRECHO_AQUI/edit
var SHEET_ID = '1XlFOgGqHBajk4XdIzp0IHXuSl78oZf2qg0qWSwWSRcg';
var SHEET_NAME = 'Leads';

// Ordem exata das colunas da planilha. Mantenha isso sincronizado com o
// cabeçalho escrito abaixo e com a ordem em que os valores são inseridos.
var CABECALHO = [
  'ID do Lead (UUID)',
  'Data/Hora',
  'Nome',
  'WhatsApp',
  'Produto',
  'Categoria',
  'Valor',
  'Página de Origem',
  'URL Completa',
  // Dados de rastreabilidade capturados automaticamente do navegador do lead.
  'Referrer',
  'User Agent',
  'Idioma',
  'Status Comercial',
  'Observações'
];

/**
 * doGet — usado apenas para testar manualmente, pelo navegador, se o
 * deploy do Web App está no ar. Não recebe nem grava nenhum dado.
 */
function doGet(e) {
  return ContentService.createTextOutput('OK - Lead capture endpoint ativo');
}

/**
 * doPost — recebe o lead enviado pelo site e grava uma nova linha na planilha.
 *
 * Importante: o site faz fetch(url, {method:'POST', body: JSON.stringify(payload)})
 * SEM header Content-Type customizado, para evitar que o navegador dispare um
 * preflight OPTIONS (que o Apps Script não trata bem). Por isso o corpo chega
 * como texto simples em e.postData.contents (com e.postData.type = "text/plain"),
 * mesmo sendo JSON de verdade. Por isso NÃO usamos e.parameter — sempre fazemos
 * JSON.parse manual do conteúdo bruto.
 */
function doPost(e) {
  try {
    var dados = JSON.parse(e.postData.contents);

    var planilha = SpreadsheetApp.openById(SHEET_ID);
    var aba = planilha.getSheetByName(SHEET_NAME);

    // Se a aba ainda não existe, cria e já escreve o cabeçalho.
    if (!aba) {
      aba = planilha.insertSheet(SHEET_NAME);
      aba.appendRow(CABECALHO);
    } else if (aba.getLastRow() === 0) {
      // Aba existe mas está vazia (sem cabeçalho) — escreve o cabeçalho antes do lead.
      aba.appendRow(CABECALHO);
    }

    // ID único simples do lead, útil como chave estável numa futura migração a um CRM.
    var idLead = Utilities.getUuid();

    // Data/Hora é sempre gerada aqui no servidor — nunca confiamos em valor vindo do cliente.
    var agora = new Date();

    // Status Comercial sempre começa como "Novo"; Observações começa vazia
    // (é o time comercial quem preenche depois, manualmente na planilha).
    aba.appendRow([
      idLead,
      agora,
      dados.nome || '',
      dados.whatsapp || '',
      dados.produto || '',
      dados.categoria || '',
      dados.valor || '',
      dados.origem || '',
      dados.pagina || '',
      dados.referrer || '',
      dados.userAgent || '',
      dados.idioma || '',
      'Novo',
      ''
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    // Devolvemos sempre HTTP 200 (Apps Script não permite customizar status
    // facilmente) — quem indica sucesso/erro é o campo "ok" no corpo da resposta.
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
