const elementos = document.querySelectorAll(".revelar");
const reduzirMovimento = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
);

if (!reduzirMovimento.matches && "IntersectionObserver" in window) {
    const observador = new IntersectionObserver((entradas) => {
        entradas.forEach((entrada) => {
            if (entrada.isIntersecting) {
                entrada.target.classList.remove("aguardando");
                entrada.target.classList.add("visivel");
                observador.unobserve(entrada.target);
            }
        });
    }, {
        threshold: 0.15
    });

    elementos.forEach((elemento) => {
        elemento.classList.add("aguardando");
        observador.observe(elemento);
    });
}

const campoBusca = document.querySelector("#busca-modelo");
const filtroFamilia = document.querySelector("#filtro-familia");
const resultadoBusca = document.querySelector("#resultado-busca");

if (campoBusca && filtroFamilia && resultadoBusca) {
    const cardsCatalogo = document.querySelectorAll(
        ".pagina-catalogo .card-modelo"
    );

    function filtrarModelos() {
        const termo = campoBusca.value.trim().toLowerCase();
        const familiaSelecionada = filtroFamilia.value;
        let quantidade = 0;

        cardsCatalogo.forEach((card) => {
            const nome = card.querySelector("h3").textContent.toLowerCase();

            const correspondeNome = nome.includes(termo);

            const correspondeFamilia =
                familiaSelecionada === "todos" ||
                card.dataset.familia === familiaSelecionada;

            if (correspondeNome && correspondeFamilia) {
                card.hidden = false;
                quantidade = quantidade + 1;
            } else {
                card.hidden = true;
            }
        });

        if (quantidade === 0) {
            resultadoBusca.textContent = "Nenhum modelo encontrado.";
        } else if (quantidade === 1) {
            resultadoBusca.textContent = "1 modelo encontrado.";
        } else {
            resultadoBusca.textContent =
                quantidade + " modelos encontrados.";
        }
    }

    campoBusca.addEventListener("input", filtrarModelos);
    filtroFamilia.addEventListener("change", filtrarModelos);

    filtrarModelos();
}

const chaveFavoritos = "porsche-store-favoritos";

function carregarFavoritos() {
    try {
        const dadosSalvos = localStorage.getItem(chaveFavoritos);
        const dados = JSON.parse(dadosSalvos);

        if (Array.isArray(dados)) {
            return dados.filter((item) => typeof item === "string");
        }

        return [];
    } catch {
        return [];
    }
}

let favoritos = carregarFavoritos();

const botoesFavorito = document.querySelectorAll("[data-favorito]");

function atualizarBotoesFavorito() {
    botoesFavorito.forEach((botao) => {
        const modelo = botao.dataset.favorito;
        const estaFavoritado = favoritos.includes(modelo);

        botao.setAttribute("aria-pressed", String(estaFavoritado));

        if (estaFavoritado) {
            botao.textContent = "♥ Favoritado";
        } else {
            botao.textContent = "♡ Favoritar";
        }
    });
}

botoesFavorito.forEach((botao) => {
    botao.addEventListener("click", () => {
        favoritos = carregarFavoritos();

        const modelo = botao.dataset.favorito;
        const estaFavoritado = favoritos.includes(modelo);
        const mensagem = botao.parentElement.querySelector(
            ".mensagem-favorito"
        );

        let novosFavoritos;

        if (estaFavoritado) {
            novosFavoritos = favoritos.filter((item) => item !== modelo);
        } else {
            novosFavoritos = [...favoritos, modelo];
        }

        try {
            localStorage.setItem(
                chaveFavoritos,
                JSON.stringify(novosFavoritos)
            );

            favoritos = novosFavoritos;
            atualizarBotoesFavorito();

            if (mensagem) {
                if (estaFavoritado) {
                    mensagem.textContent = "Modelo removido dos favoritos.";
                } else {
                    mensagem.textContent = "Modelo salvo nos favoritos.";
                }
            }
        } catch {
            if (mensagem) {
                mensagem.textContent =
                    "Não foi possível salvar. Verifique se o navegador permite armazenamento local.";
            }
        }
    });
});

atualizarBotoesFavorito();

const modelosLoja = [
    {
        id: "911-turbo-s",
        nome: "911 Turbo S",
        imagem: "img/911-turbo-s.webp",
        pagina: "911-turbo-s.html",
        descricao: "Uma presença marcante em cada detalhe."
    },
    {
        id: "911-gt3-rs",
        nome: "911 GT3 RS",
        imagem: "img/911-gt3-rs.jpg",
        pagina: "911-gt3-rs.html",
        descricao: "Para quem vive a paixão pelo automobilismo."
    },
    {
        id: "718-cayman-gt4-rs",
        nome: "718 Cayman GT4 RS",
        imagem: "img/718-cayman-gt4-rs.webp",
        pagina: "718-cayman-gt4-rs.html",
        descricao: "Uma conexão com a essência esportiva."
    },
    {
        id: "taycan-turbo-s",
        nome: "Taycan Turbo S",
        imagem: "img/taycan-turbo-s.jpg",
        pagina: "taycan-turbo-s.html",
        descricao: "Outra energia. A mesma paixão."
    },
    {
        id: "panamera-turbo-s",
        nome: "Panamera Turbo S",
        imagem: "img/panamera-turbo-s.jpg",
        pagina: "panamera-turbo-s.html",
        descricao: "Elegância e espírito esportivo no mesmo caminho."
    },
    {
        id: "cayenne-turbo-gt",
        nome: "Cayenne Turbo GT",
        imagem: "img/cayenne-turbo-gt.webp",
        pagina: "cayenne-turbo-gt.html",
        descricao: "Espírito esportivo em outra dimensão."
    }
];

const listaFavoritos = document.querySelector("#lista-favoritos");
const resumoFavoritos = document.querySelector("#resumo-favoritos");
const favoritosVazio = document.querySelector("#favoritos-vazio");

function renderizarFavoritos() {
    favoritos = carregarFavoritos();

    const modelosFavoritos = modelosLoja.filter((modelo) => {
        return favoritos.includes(modelo.id);
    });

    listaFavoritos.innerHTML = "";

    modelosFavoritos.forEach((modelo) => {
        const card = document.createElement("article");
        card.classList.add("card-modelo");

        card.innerHTML = `
            <img
                src="${modelo.imagem}"
                alt="Porsche ${modelo.nome}"
                loading="lazy"
            >
            <div class="card-conteudo">
                <h3>${modelo.nome}</h3>
                <p>${modelo.descricao}</p>

                <a class="botao" href="${modelo.pagina}">
                    Conhecer modelo
                </a>

                <button
                    class="botao-remover"
                    type="button"
                    data-remover-favorito="${modelo.id}"
                    aria-label="Remover ${modelo.nome} dos favoritos"
                >
                    Remover dos favoritos
                </button>
            </div>
        `;

        listaFavoritos.appendChild(card);
    });

    const quantidade = modelosFavoritos.length;

    favoritosVazio.hidden = quantidade > 0;

    if (quantidade === 0) {
        resumoFavoritos.textContent = "Nenhum modelo salvo.";
    } else if (quantidade === 1) {
        resumoFavoritos.textContent = "1 modelo salvo.";
    } else {
        resumoFavoritos.textContent = quantidade + " modelos salvos.";
    }
}

if (listaFavoritos && resumoFavoritos && favoritosVazio) {
    renderizarFavoritos();

    listaFavoritos.addEventListener("click", (evento) => {
        const botao = evento.target.closest("[data-remover-favorito]");

        if (!botao) {
            return;
        }

        const modelo = botao.dataset.removerFavorito;

        const novosFavoritos = carregarFavoritos().filter((item) => {
            return item !== modelo;
        });

        try {
            localStorage.setItem(
                chaveFavoritos,
                JSON.stringify(novosFavoritos)
            );
        } catch {
            resumoFavoritos.textContent =
                "Não foi possível remover o modelo. Tente novamente.";
            return;
        }

        renderizarFavoritos();

        const proximoBotao = listaFavoritos.querySelector(
            "[data-remover-favorito]"
        );

        if (proximoBotao) {
            proximoBotao.focus();
        } else {
            favoritosVazio.querySelector("a").focus();
        }
    });
}

const chaveCarrinho = "porsche-store-carrinho";

function carregarCarrinho() {
    try {
        const dadosSalvos = localStorage.getItem(chaveCarrinho);
        const dados = JSON.parse(dadosSalvos);

        if (Array.isArray(dados)) {
            return modelosLoja
                .filter((modelo) => dados.includes(modelo.id))
                .map((modelo) => modelo.id);
        }

        return [];
    } catch {
        return [];
    }
}

const botoesComprar = document.querySelectorAll("[data-comprar]");

function atualizarBotoesComprar() {
    const carrinho = carregarCarrinho();

    botoesComprar.forEach((botao) => {
        const modelo = botao.dataset.comprar;

        if (carrinho.includes(modelo)) {
            botao.textContent = "Já está no carrinho ✓";
        } else {
            botao.textContent = "Adicionar ao carrinho";
        }
    });
}

botoesComprar.forEach((botao) => {
    botao.addEventListener("click", () => {
        const modelo = botao.dataset.comprar;
        const carrinho = carregarCarrinho();

        const mensagem = botao.parentElement.querySelector(
            ".mensagem-carrinho"
        );

        if (carrinho.includes(modelo)) {
            if (mensagem) {
                mensagem.textContent =
                    "Esse modelo já está no carrinho. Clique em Ver carrinho para continuar.";
            }

            return;
        }

        const novoCarrinho = [...carrinho, modelo];

        try {
            localStorage.setItem(
                chaveCarrinho,
                JSON.stringify(novoCarrinho)
            );

            atualizarBotoesComprar();

            if (mensagem) {
                mensagem.textContent = "Modelo adicionado ao carrinho.";
            }
        } catch {
            if (mensagem) {
                mensagem.textContent =
                    "Não foi possível salvar o carrinho. Verifique o armazenamento do navegador.";
            }
        }
    });
});

atualizarBotoesComprar();

const precosIlustrativos = {
    "911-turbo-s": 1500000,
    "911-gt3-rs": 1900000,
    "718-cayman-gt4-rs": 1200000,
    "taycan-turbo-s": 1100000,
    "panamera-turbo-s": 1300000,
    "cayenne-turbo-gt": 1400000
};

const formatoMoeda = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
});

const listaCarrinho = document.querySelector("#lista-carrinho");
const conteudoCarrinho = document.querySelector("#conteudo-carrinho");
const carrinhoVazio = document.querySelector("#carrinho-vazio");
const mensagemCarrinho = document.querySelector("#mensagem-carrinho");
const quantidadeCarrinho = document.querySelector("#quantidade-carrinho");
const totalCarrinho = document.querySelector("#total-carrinho");

function renderizarCarrinho() {
    const carrinho = carregarCarrinho();

    const modelosCarrinho = modelosLoja.filter((modelo) => {
        return carrinho.includes(modelo.id);
    });

    listaCarrinho.innerHTML = "";

    let total = 0;

    modelosCarrinho.forEach((modelo) => {
        const preco = precosIlustrativos[modelo.id];
        total = total + preco;

        const card = document.createElement("article");
        card.classList.add("item-carrinho");

        card.innerHTML = `
            <img
                src="${modelo.imagem}"
                alt="Porsche ${modelo.nome}"
                loading="lazy"
            >

            <div class="item-carrinho-conteudo">
                <h3>
                    <a href="${modelo.pagina}">${modelo.nome}</a>
                </h3>

                <p>Quantidade: 1</p>

                <p class="preco-modelo">
                    ${formatoMoeda.format(preco)}
                </p>

                <button
                    class="botao-remover"
                    type="button"
                    data-remover-carrinho="${modelo.id}"
                    aria-label="Remover ${modelo.nome} do carrinho"
                >
                    Remover
                </button>
            </div>
        `;

        listaCarrinho.appendChild(card);
    });

    const quantidade = modelosCarrinho.length;

    quantidadeCarrinho.textContent = quantidade;
    totalCarrinho.textContent = formatoMoeda.format(total);

    carrinhoVazio.hidden = quantidade > 0;
    conteudoCarrinho.hidden = quantidade === 0;

    if (quantidade === 0) {
        mensagemCarrinho.textContent = "Nenhum modelo no carrinho.";
    } else if (quantidade === 1) {
        mensagemCarrinho.textContent = "1 modelo no carrinho.";
    } else {
        mensagemCarrinho.textContent =
            quantidade + " modelos no carrinho.";
    }
}

if (
    listaCarrinho &&
    conteudoCarrinho &&
    carrinhoVazio &&
    mensagemCarrinho &&
    quantidadeCarrinho &&
    totalCarrinho
) {
    renderizarCarrinho();

    listaCarrinho.addEventListener("click", (evento) => {
        const botao = evento.target.closest("[data-remover-carrinho]");

        if (!botao) {
            return;
        }

        const modelo = botao.dataset.removerCarrinho;

        const novoCarrinho = carregarCarrinho().filter((item) => {
            return item !== modelo;
        });

        try {
            localStorage.setItem(
                chaveCarrinho,
                JSON.stringify(novoCarrinho)
            );
        } catch {
            mensagemCarrinho.textContent =
                "Não foi possível remover o modelo. Tente novamente.";
            return;
        }

        renderizarCarrinho();
        atualizarBotoesComprar();

        const proximoBotao = listaCarrinho.querySelector(
            "[data-remover-carrinho]"
        );

        if (proximoBotao) {
            proximoBotao.focus();
        } else {
            carrinhoVazio.querySelector("a").focus();
        }
    });
}

const chavePedido = "porsche-store-ultimo-pedido";

function obterItensCompra() {
    const carrinho = carregarCarrinho();

    return modelosLoja
        .filter((modelo) => carrinho.includes(modelo.id))
        .map((modelo) => {
            return {
                id: modelo.id,
                nome: modelo.nome,
                preco: precosIlustrativos[modelo.id]
            };
        });
}

function mostrarResumoCompra(lista, campoTotal, itens) {
    lista.innerHTML = "";

    let total = 0;

    itens.forEach((item) => {
        const linha = document.createElement("li");
        const nome = document.createElement("span");
        const preco = document.createElement("strong");

        nome.textContent = item.nome;
        preco.textContent = formatoMoeda.format(item.preco);

        linha.append(nome, preco);
        lista.appendChild(linha);

        total = total + item.preco;
    });

    campoTotal.textContent = formatoMoeda.format(total);
}

const formFinalizacao = document.querySelector("#form-finalizacao");

if (formFinalizacao) {
    const conteudo = document.querySelector("#conteudo-finalizacao");
    const vazio = document.querySelector("#finalizacao-vazia");
    const lista = document.querySelector("#itens-finalizacao");
    const total = document.querySelector("#total-finalizacao");
    const mensagem = document.querySelector("#mensagem-finalizacao");
    const campoNome = document.querySelector("#nome-comprador");

    let itensExibidos = obterItensCompra();

    function atualizarFinalizacao() {
        itensExibidos = obterItensCompra();

        const temItens = itensExibidos.length > 0;

        conteudo.hidden = !temItens;
        vazio.hidden = temItens;

        mostrarResumoCompra(lista, total, itensExibidos);
    }

    atualizarFinalizacao();

    formFinalizacao.addEventListener("invalid", () => {
        formFinalizacao.classList.add("validado");
    }, true);

    campoNome.addEventListener("input", () => {
        campoNome.setCustomValidity("");
    });

    formFinalizacao.addEventListener("submit", (evento) => {
        evento.preventDefault();

        formFinalizacao.classList.add("validado");
        mensagem.textContent = "";

        const nome = campoNome.value.trim();

        if (nome.length < 3) {
            campoNome.setCustomValidity(
                "Digite um nome com pelo menos três caracteres."
            );
            campoNome.reportValidity();
            return;
        }

        const itensAtuais = obterItensCompra();

        if (itensAtuais.length === 0) {
            atualizarFinalizacao();
            vazio.querySelector("a").focus();
            return;
        }

        if (JSON.stringify(itensAtuais) !== JSON.stringify(itensExibidos)) {
            atualizarFinalizacao();
            mensagem.textContent =
                "Seu carrinho mudou. Confira o resumo e confirme novamente.";
            return;
        }

        const pedido = {
            numero: "PS-" + Date.now(),
            nome: nome,
            itens: itensAtuais
        };

        const botaoConfirmar = formFinalizacao.querySelector(
            'button[type="submit"]'
        );

        botaoConfirmar.disabled = true;

        try {
            sessionStorage.setItem(
                chavePedido,
                JSON.stringify(pedido)
            );

            localStorage.removeItem(chaveCarrinho);
        } catch {
            botaoConfirmar.disabled = false;
            mensagem.textContent =
                "Não foi possível concluir o pedido. Verifique o armazenamento do navegador e tente novamente.";
            return;
        }

        window.location.href = "confirmacao.html";
    });
}

function carregarPedido() {
    try {
        const pedido = JSON.parse(sessionStorage.getItem(chavePedido));

        if (
            !pedido ||
            typeof pedido.numero !== "string" ||
            typeof pedido.nome !== "string" ||
            !Array.isArray(pedido.itens) ||
            pedido.itens.length === 0
        ) {
            return null;
        }

        const itensValidos = pedido.itens.every((item) => {
            return item !== null &&
                typeof item === "object" &&
                typeof item.nome === "string" &&
                Number.isFinite(item.preco) &&
                item.preco >= 0;
        });

        return itensValidos ? pedido : null;
    } catch {
        return null;
    }
}

const pedidoConfirmado = document.querySelector("#pedido-confirmado");

if (pedidoConfirmado) {
    const pedido = carregarPedido();
    const pedidoAusente = document.querySelector("#pedido-ausente");

    pedidoConfirmado.hidden = !pedido;
    pedidoAusente.hidden = Boolean(pedido);

    if (pedido) {
        document.querySelector("#saudacao-pedido").textContent =
            pedido.nome + ", seu pedido foi registrado. Confira os detalhes abaixo.";

        document.querySelector("#numero-pedido").textContent =
            pedido.numero;

        mostrarResumoCompra(
            document.querySelector("#itens-pedido"),
            document.querySelector("#total-pedido"),
            pedido.itens
        );
    }
}

const formContato = document.querySelector("#form-contato");

if (formContato) {
    const chaveRascunho = "porsche-store-rascunho-contato";

    const nomeContato = document.querySelector("#contato-nome");
    const emailContato = document.querySelector("#contato-email");
    const assuntoContato = document.querySelector("#contato-assunto");
    const mensagemContato = document.querySelector("#contato-mensagem");

    const statusRascunho = document.querySelector("#status-rascunho");
    const retornoContato = document.querySelector("#retorno-contato");
    const limparContato = document.querySelector("#limpar-contato");

    function mostrarRetornoContato(texto, sucesso) {
        retornoContato.textContent = texto;
        retornoContato.hidden = false;

        retornoContato.classList.toggle("alert-success", sucesso);
        retornoContato.classList.toggle("alert-danger", !sucesso);
    }

    function salvarRascunhoContato() {
        const rascunho = {
            nome: nomeContato.value,
            email: emailContato.value,
            assunto: assuntoContato.value,
            mensagem: mensagemContato.value
        };

        try {
            localStorage.setItem(
                chaveRascunho,
                JSON.stringify(rascunho)
            );

            statusRascunho.textContent =
                "Rascunho salvo neste navegador.";
        } catch {
            statusRascunho.textContent =
                "Não foi possível salvar o rascunho neste navegador.";
        }
    }

    try {
        const rascunho = JSON.parse(
            localStorage.getItem(chaveRascunho)
        );

        if (rascunho && typeof rascunho === "object") {
            if (typeof rascunho.nome === "string") {
                nomeContato.value = rascunho.nome;
            }

            if (typeof rascunho.email === "string") {
                emailContato.value = rascunho.email;
            }

            if (typeof rascunho.assunto === "string") {
                assuntoContato.value = rascunho.assunto;
            }

            if (typeof rascunho.mensagem === "string") {
                mensagemContato.value = rascunho.mensagem;
            }

            statusRascunho.textContent =
                "Seu rascunho anterior foi recuperado.";
        }
    } catch {
        statusRascunho.textContent =
            "Não foi possível recuperar o rascunho anterior.";
    }

    formContato.addEventListener("input", () => {
        nomeContato.setCustomValidity("");
        mensagemContato.setCustomValidity("");

        retornoContato.hidden = true;
        salvarRascunhoContato();
    });

    formContato.addEventListener("change", salvarRascunhoContato);

    formContato.addEventListener("invalid", () => {
        formContato.classList.add("validado");
    }, true);

    formContato.addEventListener("submit", (evento) => {
        evento.preventDefault();

        formContato.classList.add("validado");

        if (nomeContato.value.trim().length < 3) {
            nomeContato.setCustomValidity(
                "Digite um nome com pelo menos três caracteres."
            );
            nomeContato.reportValidity();
            return;
        }

        if (mensagemContato.value.trim().length < 10) {
            mensagemContato.setCustomValidity(
                "Escreva uma mensagem com pelo menos dez caracteres."
            );
            mensagemContato.reportValidity();
            return;
        }

        mostrarRetornoContato(
            "Mensagem validada com sucesso. Neste projeto acadêmico, ela não é enviada. Seu texto continua disponível no formulário.",
            true
        );

        retornoContato.focus();
    });

    limparContato.addEventListener("click", () => {
        try {
            localStorage.removeItem(chaveRascunho);
        } catch {
            mostrarRetornoContato(
                "Não foi possível apagar o rascunho salvo. Tente novamente.",
                false
            );
            return;
        }

        formContato.reset();

        nomeContato.setCustomValidity("");
        mensagemContato.setCustomValidity("");

        formContato.classList.remove("validado");
        retornoContato.hidden = true;

        statusRascunho.textContent =
            "Formulário e rascunho limpos.";

        nomeContato.focus();
    });
}