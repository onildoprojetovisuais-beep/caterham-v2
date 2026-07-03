// ============================================================================
// LeadIntegration
// ----------------------------------------------------------------------------
// Camada única de integração de captura de leads. Hoje envia para Google
// Sheets via Apps Script. Para trocar para um CRM/webhook próprio no futuro,
// altere apenas a implementação de submitLead() e a URL em CONFIG — nenhum
// outro arquivo do site precisa mudar.
// ============================================================================

(function () {
  'use strict';

  var CONFIG = {
    SHEET_WEBAPP_URL: 'https://script.google.com/macros/s/AKfycbw5f3aSJdAPJnOZ175KXEQOL2y8mXxvJRZlFAjdLmQsKLeKSqQ0GBBikdIabtL5xGrN/exec',
    ORIGEM_PADRAO: 'Landing Page Race Experience',
    WHATSAPP_PHONE: '5515998570854'
  };

  // Mapa de mensagens padrão do WhatsApp por produto.
  var MESSAGES = {
    'fastlap-ss600': function (nome) {
      return 'Olá!\nMeu nome é ' + nome + '.\n\n' +
        'Tenho interesse no pacote Fast Laps – SS600.\n\n' +
        'Acabei de realizar meu cadastro pelo site e gostaria de receber mais informações sobre disponibilidade e reserva.';
    },
    'fastlap-420r': function (nome) {
      return 'Olá!\nMeu nome é ' + nome + '.\n\n' +
        'Tenho interesse no pacote Fast Laps – 420R.\n\n' +
        'Acabei de realizar meu cadastro pelo site e gostaria de receber mais informações sobre disponibilidade e reserva.';
    },
    'fastlap-combo': function (nome) {
      return 'Olá!\nMeu nome é ' + nome + '.\n\n' +
        'Tenho interesse no pacote Fast Laps Combo.\n\n' +
        'Acabei de realizar meu cadastro pelo site e gostaria de receber mais informações sobre disponibilidade e reserva.';
    },
    'race-pole-position': function (nome) {
      return 'Olá!\nMeu nome é ' + nome + '.\n\n' +
        'Tenho interesse no pacote Race Experience – Pole Position.\n\n' +
        'Acabei de realizar meu cadastro pelo site e gostaria de receber mais informações sobre disponibilidade e reserva.';
    },
    'race-podium-club': function (nome) {
      return 'Olá!\nMeu nome é ' + nome + '.\n\n' +
        'Tenho interesse no pacote Race Experience – Podium Club.\n\n' +
        'Acabei de realizar meu cadastro pelo site e gostaria de receber mais informações sobre disponibilidade e reserva.';
    },
    'race-champion-experience': function (nome) {
      return 'Olá!\nMeu nome é ' + nome + '.\n\n' +
        'Tenho interesse no pacote Race Experience – Champion Experience.\n\n' +
        'Acabei de realizar meu cadastro pelo site e gostaria de receber mais informações sobre disponibilidade e reserva.';
    }
  };

  /**
   * Envia o lead para a planilha (Google Apps Script Web App).
   * NUNCA rejeita — sempre resolve, mesmo em caso de erro de rede, para que
   * o fluxo de abertura do WhatsApp não seja bloqueado.
   * @param {Object} lead {nome, whatsapp, produto, categoria, valor, origem, productKey}
   * @returns {Promise<Object>} {ok, skipped?, error?}
   */
  function submitLead(lead) {
    lead = lead || {};

    if (!CONFIG.SHEET_WEBAPP_URL) {
      console.warn('[LeadIntegration] SHEET_WEBAPP_URL não configurada — envio para a planilha foi pulado.');
      return Promise.resolve({ ok: false, skipped: true });
    }

    var payload = {
      nome: lead.nome,
      whatsapp: lead.whatsapp,
      produto: lead.produto,
      categoria: lead.categoria,
      valor: lead.valor,
      origem: lead.origem || CONFIG.ORIGEM_PADRAO,
      pagina: window.location.href,
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      idioma: navigator.language
    };

    // IMPORTANTE: não definir o header Content-Type manualmente. Isso faria o
    // navegador disparar um preflight CORS (OPTIONS) que o Google Apps Script
    // não responde corretamente. Enviando o body como string, o navegador usa
    // text/plain por padrão e evita o preflight.
    return fetch(CONFIG.SHEET_WEBAPP_URL, {
      method: 'POST',
      body: JSON.stringify(payload)
    })
      .then(function () {
        return { ok: true };
      })
      .catch(function (error) {
        console.error('[LeadIntegration] Falha ao enviar lead para a planilha:', error);
        return { ok: false, error: error };
      });
  }

  /**
   * Monta a URL completa do WhatsApp (https://wa.me/...?text=...) para o
   * produto e nome informados.
   * @param {string} productKey
   * @param {string} nome
   * @returns {string}
   */
  function buildWhatsAppUrl(productKey, nome) {
    var builder = MESSAGES[productKey];
    var mensagem;

    if (builder) {
      mensagem = builder(nome);
    } else {
      mensagem = 'Olá!\nMeu nome é ' + nome + ' e tenho interesse na Race Experience. ' +
        'Acabei de realizar meu cadastro pelo site e gostaria de receber mais informações sobre disponibilidade e reserva.';
    }

    return 'https://wa.me/' + CONFIG.WHATSAPP_PHONE + '?text=' + encodeURIComponent(mensagem);
  }

  /**
   * Abre a URL do WhatsApp em uma nova aba.
   * @param {string} url
   */
  function openWhatsApp(url) {
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  /**
   * Orquestra o envio do lead: tenta gravar na planilha e, independente do
   * resultado (sucesso ou falha), abre o WhatsApp com a mensagem do produto.
   * @param {Object} lead {nome, whatsapp, produto, categoria, valor, origem, productKey}
   * @returns {Promise<Object>} resultado de submitLead (para log/telemetria futura)
   */
  function handleLeadSubmit(lead) {
    lead = lead || {};
    return submitLead(lead).then(function (result) {
      openWhatsApp(buildWhatsAppUrl(lead.productKey, lead.nome));
      return result;
    });
  }

  window.LeadIntegration = {
    CONFIG: CONFIG,
    submitLead: submitLead,
    buildWhatsAppUrl: buildWhatsAppUrl,
    openWhatsApp: openWhatsApp,
    handleLeadSubmit: handleLeadSubmit
  };
})();
