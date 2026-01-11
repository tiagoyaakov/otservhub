Guia de Implementação: Stripe Checkout (Node.js)

Esta documentação descreve como criar uma Checkout Session utilizando a biblioteca oficial do Stripe para Node.js. O foco principal é a configuração correta dos parâmetros de venda e o uso de metadados para identificar o comprador e o recurso adquirido.

1. O que é o Stripe Checkout?

O Stripe Checkout é uma página de pagamento inteligente e pré-construída, hospedada pelo Stripe. Ela lida com a interface do usuário, validação de cartões e conformidade com normas de segurança (PCI), permitindo que você aceite pagamentos rapidamente sem construir um formulário do zero.

2. Instalação e Configuração

Primeiro, instale a biblioteca oficial no seu projeto Node.js:

npm install stripe


No seu código, inicialize o Stripe com sua Chave Secreta (Secret Key):

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


3. Criando uma Checkout Session

Para iniciar um pagamento, você deve criar uma session. Abaixo estão os parâmetros fundamentais:

Parâmetros Essenciais

Parâmetro

Descrição

line_items

Lista de produtos que o cliente está comprando. Inclui preço, moeda e quantidade.

mode

O tipo de transação. Use 'payment' para compras únicas ou 'subscription' para planos recorrentes.

success_url

A URL para onde o cliente será redirecionado após o pagamento ser concluído com sucesso.

cancel_url

A URL para onde o cliente retornará se desistir do checkout.

metadata

Um objeto de chave-valor para armazenar informações extras que não são visíveis ao cliente, mas essenciais para o seu backend.

4. Exemplo Prático (Node.js)

Este exemplo demonstra como criar uma sessão para a venda de um "Slot" específico.

const stripe = require('stripe')('sua_chave_secreta_aqui');

async function createCheckoutSession(userData, slotData) {
  try {
    const session = await stripe.checkout.sessions.create({
      // 1. Meios de pagamento aceitos
      payment_method_types: ['card'],

      // 2. Itens do carrinho
      line_items: [
        {
          price_data: {
            currency: 'brl', // Moeda em Real Brasileiro
            product_data: {
              name: `Reserva de Slot: ${slotData.name}`,
              description: `Agendamento para o dia ${slotData.date}`,
            },
            unit_amount: 5000, // R$ 50,00 (O valor é sempre em centavos)
          },
          quantity: 1,
        },
      ],

      // 3. Modo de operação
      mode: 'payment',

      // 4. Redirecionamentos
      success_url: `https://seu-site.com/sucesso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `https://seu-site.com/agendamento`,

      // 5. METADADOS (O ponto mais importante para o seu sistema)
      // Aqui você identifica QUEM comprou e QUAL slot foi ocupado.
      metadata: {
        userId: userData.id,       // ID do usuário no seu banco de dados
        slotId: slotData.id,       // ID do slot/vaga que está sendo comprada
        userEmail: userData.email, // Facilitador para conferência
        tipoReserva: 'premium'     // Exemplo de tag extra
      },
    });

    return session.url; // Retorne esta URL para redirecionar o usuário
  } catch (error) {
    console.error('Erro ao criar sessão de checkout:', error);
    throw error;
  }
}


5. Por que usar Metadados (Metadata)?

Os metadados são a ponte entre o pagamento no Stripe e o seu banco de dados. Quando o Stripe confirma o pagamento (geralmente via Webhook), ele envia de volta o objeto metadata exatamente como você o enviou.

Fluxo de Uso:

Frontend: O usuário clica em "Comprar Slot X".

Backend: Você cria a sessão enviando userId: 123 e slotId: X no metadata.

Stripe: Processa o cartão do usuário.

Webhook: O Stripe envia uma notificação para o seu servidor dizendo: "O pagamento da sessão ABC foi aprovado. Os metadados são {userId: 123, slotId: X}".

Seu Sistema: Com essas informações, você marca o Slot X como "Ocupado" para o Usuário 123 no seu banco de dados.

6. Boas Práticas

Valores em Centavos: Lembre-se que unit_amount: 100 equivale a R$ 1,00. Nunca envie valores decimais (ex: 10.50), multiplique por 100 antes de enviar.

Segurança: Nunca confie apenas na success_url para liberar o produto. Sempre use Webhooks (evento checkout.session.completed) para confirmar que o pagamento foi realmente processado.

ID da Sessão: Na success_url, use a variável {CHECKOUT_SESSION_ID}. O Stripe a substituirá automaticamente pelo ID real da sessão ao redirecionar o usuário, permitindo que você valide o status na página de agradecimento.

Documentação gerada para auxílio técnico em integrações de meios de pagamento.