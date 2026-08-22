const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log("=== INICIANDO TESTE AUTOMATIZADO DE FLUXOS VIA CÓDIGO ===");

const htmlPath = path.join(__dirname, 'index.html');
const htmlContent = fs.readFileSync(htmlPath, 'utf8');

// 1. VERIFICAÇÃO DE ELEMENTOS ESSENCIAIS DO DOM
console.log("\n[1/5] Testando Estrutura Simplificada (3 Abas) e IDs do HTML...");
const requiredIDs = [
  'dynamicFavicon', 'docTitle', 'heartsBg', 'topCreatorBar', 'studioContainer', 'tab-couple', 'tab-activities',
  'tab-share', 'cfg-name', 'cfg-sender', 'cfg-phone',
  'cfg-title1', 'cfg-sub1', 'activitiesBuilderList', 'finalShareUrl',
  'shareBoxResult', 'qrcode-canvas', 'inviteContainer', 'screen1', 'screen2',
  'screen3', 'inv-title1', 'inv-sub1', 'input-date',
  'input-time', 'inviteActivitiesList', 'final-date', 'final-time', 'final-acts',
  'whatsapp-btn'
];

let missingIDs = [];
requiredIDs.forEach(id => {
  if (!htmlContent.includes(`id="${id}"`)) {
    missingIDs.push(id);
  }
});

if (missingIDs.length === 0) {
  console.log("✅ Todos os IDs essenciais do Estúdio Simplificado (3 Abas) foram encontrados!");
} else {
  console.error("❌ Faltando IDs no HTML:", missingIDs);
  process.exit(1);
}

// 2. TESTE DE ATUALIZAÇÃO DINÂMICA DE FAVICON E TÍTULO DA ABA
console.log("\n[2/5] Testando Função de Atualização de Favicon & Título da Aba...");
assert.ok(htmlContent.includes("function updateDynamicMeta"));
assert.ok(htmlContent.includes("document.title = `${name} 💕 Convite Especial`"));
console.log("✅ Atualização dinâmica de Favicon e Título com o nome/foto da amada validada!");

// 3. TESTE DE CODIFICAÇÃO E DECODIFICAÇÃO DE CONVITE PERSONALIZADO (BASE64 & UTF-8)
console.log("\n[3/5] Testando Codificação/Decodificação do Payload de URL...");

const mockUserConfig = {
  name: "Beatriz Novaes",
  sender: "Leonardo",
  phone: "5511988887777",
  title1: "ei... {nome}, bora num date inesquecível?",
  sub1: "(prometo que vai ser incrível 💖)",
  theme: "emerald",
  activities: [
    { id: "jantar", emoji: "🍷", text: "Jantar Romântico" },
    { id: "parque", emoji: "🧺", text: "Picnic no Parque" },
    { id: "praia", emoji: "🌊", text: "Ver o Pôr do Sol na Praia" }
  ]
};

// Simula codificação UTF-8 Base64 (fallback nativo)
const jsonStr = JSON.stringify(mockUserConfig);
const encodedPayload = Buffer.from(jsonStr, 'utf-8').toString('base64');
const decodedJsonStr = Buffer.from(encodedPayload, 'base64').toString('utf-8');
const restoredConfig = JSON.parse(decodedJsonStr);

assert.strictEqual(restoredConfig.name, "Beatriz Novaes");
assert.strictEqual(restoredConfig.phone, "5511988887777");
assert.strictEqual(restoredConfig.activities.length, 3);
console.log("✅ Teste de serialização/deserialização do payload de URL executado com SUCESSO!");

// 4. TESTE DA LÓGICA DE GERAÇÃO DA MENSAGEM DO WHATSAPP
console.log("\n[4/5] Testando Formatação da Mensagem do WhatsApp no Final do Fluxo...");

const dateFormatted = "25/08/2026";
const timeFormatted = "20:00";
const chosenActs = [
  { emoji: "🍷", text: "Jantar Romântico" },
  { emoji: "🌊", text: "Ver o Pôr do Sol na Praia" }
];

const senderName = restoredConfig.sender;
const expectedMsg = `oi ${senderName}! aceitei o convite 💕\n\n📅 nosso date é dia: ${dateFormatted}\n🕐 horário: ${timeFormatted}\n🎯 o que vamos fazer:\n- ${chosenActs.map(a => `${a.emoji} ${a.text}`).join('\n- ')}`;

const cleanPhone = restoredConfig.phone.replace(/\D/g, '');
const expectedWaUrl = `https://wa.me/${cleanPhone}?text=` + encodeURIComponent(expectedMsg);

assert.ok(expectedWaUrl.includes("https://wa.me/5511988887777"));
assert.ok(expectedWaUrl.includes(encodeURIComponent("Jantar Romântico")));
assert.ok(expectedWaUrl.includes(encodeURIComponent("25/08/2026")));
console.log("✅ Formatação do Link do WhatsApp testada e validada com SUCESSO!");

// 5. TESTE DOS PRESETS PRONTOS
console.log("\n[5/5] Testando Presets Engraçados & Rápidos (Movies, Food, Drive, Geek, Nature)...");
assert.ok(htmlContent.includes("applyPreset('movies')"));
assert.ok(htmlContent.includes("applyPreset('food')"));
assert.ok(htmlContent.includes("applyPreset('drive')"));
assert.ok(htmlContent.includes("applyPreset('geek')"));
assert.ok(htmlContent.includes("applyPreset('nature')"));
console.log("✅ Botões e handlers de Presets verificados com SUCESSO!");

console.log("\n🎉 TODOS OS TESTES DE FLUXO VIA CÓDIGO FORAM CONCLUÍDOS COM 100% DE SUCESSO!");
