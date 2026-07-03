# Configuração da captura de leads via Google Sheets

Guia passo a passo para configurar o "banco de dados" de leads da Race Experience
usando Google Sheets + Google Apps Script, sem precisar de backend próprio.

Não precisa saber programar. Se tiver dúvida em algum passo, peça ajuda a alguém
técnico só para essa parte — o resto é copiar e colar.

---

## Caminho recomendado: usar os arquivos prontos

Antes de criar uma planilha do zero, veja se este é o seu caso: já existem dois
arquivos prontos nesta mesma pasta (`google-apps-script/`), já com o cabeçalho
correto, as cores da marca (verde escuro/lime/preto/branco), a coluna
**"Status Comercial"** destacada visualmente, a primeira linha congelada,
filtro automático e a lista suspensa (validação de dados) da coluna
"Status Comercial" já configurada:

- `Race Experience - Leads.xlsx`
- `Race Experience - Leads.csv` (mesmo conteúdo/estrutura — útil se você
  preferir **importar como uma nova aba** dentro de uma planilha que já existe,
  em vez de abrir um arquivo novo)

Como nesses arquivos o cabeçalho, as cores, o congelamento de linha, o filtro e
a validação da coluna "Status Comercial" **já vêm prontos**, esse é o caminho
mais rápido — evita criar a planilha em branco e depender do `Code.gs` para
escrever o cabeçalho na primeira execução. Passo a passo:

1. Baixe/abra o arquivo `Race Experience - Leads.xlsx` (ou use a versão `.csv`
   se for importar como aba dentro de uma planilha já existente).
2. Faça upload dele no Google Drive e abra com o Google Sheets — ou, se já
   existe uma planilha em uso, vá em **Arquivo > Importar**, escolha o arquivo
   e selecione a opção **"Inserir nova aba"**.
3. Renomeie o documento (título, no canto superior esquerdo) para
   **"Race Experience | Leads"**, se ainda não estiver assim.
4. Confira que a aba (guia na parte de baixo da tela) se chama **exatamente**
   **"Leads"** — isso é obrigatório para o `Code.gs` funcionar. Se, ao
   importar, o Google Sheets criar a aba com outro nome (ex: "Race Experience
   - Leads" ou "Sheet1"), renomeie a aba manualmente para **"Leads"**.
5. A partir daí, siga o resto deste guia normalmente: pegue o ID da planilha,
   cole no `Code.gs` (seção d) e faça o deploy (seção e).

Com esse caminho você pode pular as seções (a) e (b) logo abaixo — elas
descrevem como montar a planilha do zero, manualmente, caso prefira ou precise
fazer assim.

---

## a) Criar a planilha (caminho alternativo, do zero)

> Só siga esta seção se **não** for usar os arquivos prontos descritos acima.

1. Acesse [sheets.google.com](https://sheets.google.com) e crie uma planilha em branco.
2. Renomeie a planilha (clique no título no canto superior esquerdo) para:
   **Leads — Race Experience**

## b) Renomear a primeira aba (caminho alternativo, do zero)

1. Clique com o botão direito na aba na parte de baixo da tela (geralmente chamada "Página1").
2. Escolha "Renomear" e mude o nome para: **Leads**

Não crie o cabeçalho manualmente — veja o próximo item.

## c) Estrutura de colunas

Se você usou o caminho recomendado (arquivo `.xlsx`/`.csv` pronto), a linha de
cabeçalho abaixo já vem pronta na planilha — não precisa digitar nada, só
conferir se bate com a tabela a seguir. Se você criou a planilha do zero
(caminho alternativo, seções a e b), o script (`Code.gs`) escreve essa linha
de cabeçalho automaticamente na primeira execução, exatamente nesta ordem:

| Coluna | Para que serve |
|---|---|
| **ID do Lead (UUID)** | Identificador único gerado automaticamente pelo servidor (Apps Script, `Utilities.getUuid()`). Serve como chave estável caso o lead precise ser migrado para um CRM no futuro. |
| **Data/Hora** | Quando o lead chegou. Gerada pelo servidor (Apps Script), não pelo navegador do visitante — evita data errada por fuso horário ou relógio do celular desconfigurado. |
| **Nome** | Nome informado no formulário. |
| **WhatsApp** | Telefone de contato — principal canal do time comercial. |
| **Produto** | Qual pacote/experiência específica o lead escolheu. |
| **Categoria** | Fast Laps ou Race Experience — para separar leads por tipo de produto. |
| **Valor** | Valor do pacote no momento do envio, útil para priorizar atendimento. |
| **Página de Origem** | Rótulo/label de origem do lead (ex: "Landing Page Race Experience"), útil quando houver mais de uma origem no futuro. **Atenção:** isto não é uma URL, é só um nome descritivo de onde veio o lead. |
| **URL Completa** | Endereço (URL) exato da página onde o formulário foi preenchido — útil para saber qual anúncio/página converteu. |
| **Referrer** | De qual página/site a pessoa veio antes de chegar no site (ex: um post do Instagram, uma busca no Google, ou vazio se digitou o link direto). Útil para entender quais canais estão trazendo leads. |
| **User Agent** | Informação técnica do navegador e dispositivo usado pelo visitante (ex: Chrome no Android, Safari no iPhone). Captado automaticamente, não exige nada do time comercial — serve principalmente para diagnóstico técnico. |
| **Idioma** | Idioma configurado no navegador do visitante. Captado automaticamente, dado auxiliar de baixo uso comercial direto. |
| **Status Comercial** | Etapa do funil comercial (ver lista suspensa abaixo). Toda linha nova é criada com o valor fixo "Novo"; as demais opções são preenchidas manualmente pelo time à medida que o funil avança. |
| **Observações** | Campo livre para anotações do time comercial (ex: "ligar depois das 18h"). Começa sempre vazio, preenchido manualmente depois. |

### Lista suspensa em "Status Comercial"

Se você usou um dos arquivos prontos (`.xlsx`/`.csv`), essa lista suspensa
**já vem configurada** na coluna "Status Comercial" — não precisa fazer nada.
Esta seção fica aqui só como referência, caso precise recriar essa validação
do zero (por exemplo, numa cópia da planilha ou numa aba nova).

Para transformar a coluna "Status Comercial" em uma lista suspensa manualmente:

1. Selecione a coluna inteira de "Status Comercial" (clique na letra da coluna).
2. Vá em **Dados > Validação de dados**.
3. Em "Critérios", escolha **"Lista de itens"**.
4. Cole as opções separadas por vírgula:
   `Novo, Contato iniciado, Em negociação, Confirmado, Perdido`
5. Marque "Rejeitar entrada" (para não deixar digitar valor fora da lista).
6. Clique em "Concluído".

Assim, cada linha vai mostrar uma setinha para escolher o status com um clique.

---

## d) Abrir o editor de Apps Script e colar o Code.gs

1. Com a planilha aberta, vá em **Extensões > Apps Script**.
2. Isso abre um editor de código em outra aba, já vinculado a esta planilha.
3. Apague qualquer código de exemplo que já esteja lá (geralmente um `function myFunction() {}`).
4. Abra o arquivo `Code.gs` deste repositório, copie todo o conteúdo e cole no editor do Apps Script.
5. No topo do arquivo colado, encontre esta linha:
   ```js
   var SHEET_ID = 'COLE_AQUI_O_ID_DA_PLANILHA';
   ```
6. Troque `COLE_AQUI_O_ID_DA_PLANILHA` pelo ID real da sua planilha. O ID fica
   na URL da planilha, entre `/d/` e `/edit`:
   ```
   https://docs.google.com/spreadsheets/d/ESTE_TRECHO_AQUI_E_O_ID/edit#gid=0
   ```
7. Salve o arquivo (ícone de disquete ou Ctrl+S).

## e) Fazer o Deploy (publicar o Web App)

1. No editor do Apps Script, clique em **Implantar > Nova implantação**.
2. Clique no ícone de engrenagem ao lado de "Selecionar tipo" e escolha **"App da Web"**.
3. Configure:
   - **Executar como:** Eu (sua conta Google)
   - **Quem tem acesso:** Qualquer pessoa
4. Clique em **Implantar**.
5. O Google pode pedir para autorizar permissões — aceite (é a sua própria conta acessando sua própria planilha).
6. Ao final, será exibida uma **URL do Web App**, terminando em `/exec`. Copie essa URL.

> Toda vez que você editar o `Code.gs` depois disso, é preciso fazer uma
> **nova implantação** (ou "Gerenciar implantações > editar > nova versão")
> para que as mudanças entrem em vigor na URL publicada.

---

## f) ATENÇÃO: onde colar a URL do Web App

**A URL do Web App copiada no passo (e) deve ser colada no arquivo
`scripts/lead-integration.js`, na constante `CONFIG.SHEET_WEBAPP_URL`.**

Esse arquivo é criado/mantido por outro colega em paralelo — você não precisa
criá-lo nem mexer no código dele, apenas garantir que a URL correta chegue até
essa pessoa (ou colar você mesmo, se já existir).

---

## g) Testando

1. Cole a URL do Web App (a que termina em `/exec`) diretamente na barra de
   endereços do navegador e pressione Enter.
2. Deve aparecer o texto: **"OK - Lead capture endpoint ativo"**. Se aparecer
   isso, o deploy está funcionando.
3. Para testar o envio de um lead de verdade, use o formulário real do site
   (depois que `scripts/lead-integration.js` estiver configurado com a URL) ou
   peça para alguém técnico simular um envio de teste.
4. Depois do teste, volte na planilha, aba **Leads**, e confira se uma nova
   linha apareceu com Data/Hora, Nome, WhatsApp etc., e com "Status Comercial"
   já como **Novo**.

## h) Migrando para um CRM no futuro

Quando a empresa tiver um CRM ou webhook próprio, a troca é simples: basta
atualizar a URL de destino no arquivo `scripts/lead-integration.js` para apontar
para o novo endpoint. Não é necessário mexer no `Code.gs` nem apagar a planilha
— eles podem continuar existindo como backup histórico de todos os leads
capturados até a migração.
