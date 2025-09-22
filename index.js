import fetch from 'node-fetch';
import cron from 'node-cron';

// ⚠️ CAMBIA ESTA DIRECCIÓN POR LA TUYA ⚠️
const WALLET_ADDRESS = '0xc326f4cC63438FF6b7739EeD690Afd508d5a5c97';
const FAUCET_URL = 'https://faucet.morkie.xyz/api/monad';

async function claimFaucet() {
    const timestamp = new Date().toISOString();
    console.log(`🚀 [${timestamp}] Iniciando claim del faucet...`);
    
    try {
        const response = await fetch(FAUCET_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'MorkieFaucetBot/1.0'
            },
            body: JSON.stringify({
                address: WALLET_ADDRESS
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        
        if (data.success) {
            console.log(`✅ [${timestamp}] ¡Claim exitoso!`);
            console.log(`   📋 Hash: ${data.transactionHash}`);
            console.log(`   💰 Cantidad: ${data.amountReceived} tokens`);
            console.log(`   🏆 Tier: ${data.tier}`);
            console.log(`   💼 Balance: ${data.morkieBalance}`);
            console.log(`   ⏰ Próximo claim: ${new Date(data.nextClaimAvailable).toLocaleString()}`);
        } else {
            console.log(`❌ [${timestamp}] Claim falló:`, JSON.stringify(data, null, 2));
        }
        
        return data;
    } catch (error) {
        console.error(`🔥 [${timestamp}] Error en el claim:`, error.message);
        return null;
    }
}

// Función para ejecutar claim manual (útil para testing)
async function runClaimNow() {
    console.log('🧪 Ejecutando claim manual para pruebas...');
    await claimFaucet();
}

// Configurar cron job - 2 veces por día
// 8:00 AM y 8:00 PM UTC (ajusta según tu zona horaria)
console.log('⚙️ Configurando cron jobs...');

// Primera ejecución a las 8:00 AM UTC
cron.schedule('0 8 * * *', () => {
    console.log('⏰ Cron job ejecutándose - 8:00 AM UTC');
    claimFaucet();
}, {
    scheduled: true,
    timezone: "UTC"
});

// Segunda ejecución a las 8:00 PM UTC  
cron.schedule('0 20 * * *', () => {
    console.log('⏰ Cron job ejecutándose - 8:00 PM UTC');
    claimFaucet();
}, {
    scheduled: true,
    timezone: "UTC"
});

console.log('🤖 Bot iniciado correctamente!');
console.log('📅 Programado para ejecutarse 2 veces por día:');
console.log('   🌅 8:00 AM UTC');
console.log('   🌙 8:00 PM UTC');
console.log(`💼 Wallet configurada: ${WALLET_ADDRESS}`);
console.log('⚡ El bot está corriendo y esperando los horarios programados...');

// Ejecutar un claim de prueba al iniciar (opcional)
if (process.env.RUN_TEST_CLAIM === 'true') {
    console.log('\n🧪 Ejecutando claim de prueba al iniciar...');
    setTimeout(runClaimNow, 3000); // Esperar 3 segundos antes del claim de prueba
}

// Mantener el proceso activo
process.on('SIGTERM', () => {
    console.log('🛑 Recibida señal SIGTERM, cerrando bot...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('🛑 Recibida señal SIGINT, cerrando bot...');
    process.exit(0);
});

// Mantener el proceso vivo
setInterval(() => {
    console.log(`💓 Bot activo - ${new Date().toISOString()}`);
}, 60 * 60 * 1000); // Heartbeat cada hora
