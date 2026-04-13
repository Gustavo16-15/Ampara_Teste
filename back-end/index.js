 // 1. PRIMEIRO OS IMPORTS (No topo do arquivo)
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { MercadoPagoConfig, Preference } from "mercadopago";
import path from "path";
import { fileURLToPath } from "url";

// 2. CONFIGURAÇÕES DE DIRETÓRIO (Logo após os imports)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// 3. SERVIR OS ARQUIVOS DO FRONT-END 
// (Isso faz o Render entender que a pasta front_end deve ser mostrada no navegador)
app.use(express.static(path.join(__dirname,  "front_end")));

const PORT = process.env.PORT || 3000;
const { MERCADOPAGO_ACCESS_TOKEN } = process.env;

// 4. ROTA PARA ABRIR O SITE (Página Inicial)
app.post("/", (req, res) => {
    res.sendFile(path.join(__dirname,  "front_end", "index.html"));
});

// 5. SUA ROTA DO MERCADO PAGO
app.post('/api/create-preference', async (req, res) => {
    const client = new MercadoPagoConfig({
        accessToken: MERCADOPAGO_ACCESS_TOKEN,
        options: { timeout: 5000 },
    });

    const preference = new Preference(client);

    const body = {
        items: [
            {
                id: '1234',
                title: 'Tônico Capilar Ampara',
                quantity: 1,
                currency_id: 'BRL',
                unit_price: 199.99,
            },
        ],
        back_urls: {
            // Aqui usamos o link real do Render que vi no seu print
            success: 'https://ampara-teste.onrender.com',
            failure: 'https://ampara-teste.onrender.com',
            pending: 'https://ampara-teste.onrender.com',
        },
        auto_return: 'approved',
    };

    try {
        const response = await preference.create({ body });
        res.json({
            id: response.id,
            init_point: response.init_point
        });
    } catch (error) {
        console.error("ERRO:", error);
        res.status(500).json({ error: error.message });
    }
});

// 6. INICIALIZAÇÃO DO SERVIDOR
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});