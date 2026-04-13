// Seleciona todos os botões que têm a classe 'btn' ou que estão dentro de seções de compra
const botoesCompra = document.querySelectorAll('button');

botoesCompra.forEach(botao => {
    // Verifica se é um dos botões de tratamento
    if  (botao.textContent.toUpperCase().includes("TRATAMENTO")) {
        botao.addEventListener('click', async () => {
            botao.disabled = true;
            botao.textContent = "CARREGANDO...";

            try {
                // 1. Chama o seu servidor Node
                const res = await fetch('https://ampara-teste.onrender.com/api/create-preference', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' }
                });

                console.log("Status da resposta:", res.status); // Verifique se aparece 200 ou 500
                
                const dados = await res.json();

                // 2. Redireciona para o Mercado Pago
                if (dados.init_point) {
                    window.location.href = dados.init_point;
                }
            } catch (err) {
                alert("Erro ao conectar com o servidor.");
                botao.disabled = false;
                botao.textContent = "QUERO COMEÇAR MEU TRATAMENTO";
            }
        });
    }
});