const TEMPO_BLOQUEIO = 15 * 60 * 1000;
const MAX_TENTATIVAS = 5;
if (!localStorage.getItem("usuarios")) {
    const usuariosIniciais = [
        {
            nome: "Administrador",
            email: "admin@email.com",
            senha: "123456"
        }
    ];
    localStorage.setItem(
        "usuarios",
        JSON.stringify(usuariosIniciais)
    );
}
function obterUsuarios() {
    try {
        return JSON.parse(
            localStorage.getItem("usuarios")
        ) || [];
    } catch (erro) {
        return [];
    }
}
function salvarUsuarios(usuarios) {
    localStorage.setItem(
        "usuarios",
        JSON.stringify(usuarios)
    );
}
function validarEmail(email) {
    const regex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}
function obterTentativas() {
    return Number(
        localStorage.getItem("tentativasLogin")
    ) || 0;
}
function registrarErroLogin(mensagem) {
    let tentativas = obterTentativas();
    tentativas++;
    localStorage.setItem(
        "tentativasLogin",
        tentativas
    );
    if (tentativas >= MAX_TENTATIVAS) {
        const bloqueioAte =
            Date.now() + TEMPO_BLOQUEIO;
        localStorage.setItem(
            "bloqueioLogin",
            bloqueioAte
        );
        alert(
            mensagem +
            "\n\nVocê atingiu o limite de 5 tentativas." +
            "\nO login foi bloqueado por 15 minutos."
        );
        return;
    }   
    const restantes =
        MAX_TENTATIVAS - tentativas;
    alert(
        mensagem +
        "\n\nTentativa " +
        tentativas +
        " de " +
        MAX_TENTATIVAS +
        "." +
        "\nRestam " +
        restantes +
        " tentativa(s)."
    );
}
function verificarBloqueio() {
    const bloqueioAte = Number(
        localStorage.getItem("bloqueioLogin")
    ) || 0;
    // Não está bloqueado
    if (bloqueioAte === 0) {
        return false;
    }
    // Ainda está bloqueado
    if (Date.now() < bloqueioAte) {
        const restante =
            bloqueioAte - Date.now();
        const minutos =
            Math.floor(restante / 60000);
        const segundos =
            Math.ceil((restante % 60000) / 1000);
        alert(
            "Login bloqueado.\n\n" +
            "Tente novamente em " +
            minutos +
            " minuto(s) e " +
            segundos +
            " segundo(s)."
        );
        return true;
    }
    // Bloqueio terminou
    localStorage.removeItem(
        "bloqueioLogin"
    );
    localStorage.removeItem(
        "tentativasLogin"
    );
    return false;
}
const formLogin =
    document.getElementById("form");
if (formLogin) {
    formLogin.addEventListener(
        "submit",
        function (event) {
            event.preventDefault();
            if (verificarBloqueio()) {
                return;
            }
            // ------------------------------------------
            // PEGA OS DADOS
            // ------------------------------------------
            const email =
                document
                    .getElementById("usuario")
                    .value
                    .trim()
                    .toLowerCase();
            const senha =
                document
                    .getElementById("senha")
                    .value;
            // ------------------------------------------
            // VALIDA E-MAIL
            // ------------------------------------------
            if (!validarEmail(email)) {
                registrarErroLogin(
                    "Digite um e-mail válido."
                );
                return;
            }
            // ------------------------------------------
            // BUSCA USUÁRIO
            // ------------------------------------------
            const usuarios =
                obterUsuarios();
            const usuario =
                usuarios.find(
                    function (item) {
                        return item.email === email;
                    }
                );
            // ------------------------------------------
            // E-MAIL NÃO ENCONTRADO
            // ------------------------------------------
            if (!usuario) {
                registrarErroLogin(
                    "E-mail não cadastrado."
                );
                return;
            }
            // ------------------------------------------
            // SENHA ERRADA
            // ------------------------------------------
            if (usuario.senha !== senha) {
                registrarErroLogin(
                    "Senha incorreta."
                );
                return;
            }
            // ------------------------------------------
            // LOGIN CORRETO
            // ------------------------------------------
            localStorage.setItem(
                "usuarioLogado",
                usuario.email
            );
            localStorage.setItem(
                "nomeUsuarioLogado",
                usuario.nome
            );
            // Zera tentativas
            localStorage.removeItem(
                "tentativasLogin"
            );
            localStorage.removeItem(
                "bloqueioLogin"
            );
            // Vai para Home
            window.location.href =
                "home.html";
        }
    );
}
// ======================================================
// CADASTRO
// ======================================================
const formCadastro =
    document.getElementById(
        "formCadastro"
    );
if (formCadastro) {
    formCadastro.addEventListener(
        "submit",
        function (event) {
            event.preventDefault();
            // ------------------------------------------
            // PEGA OS DADOS
            // ------------------------------------------
            const nome =
                document
                    .getElementById("novoNome")
                    .value
                    .trim();
            const email =
                document
                    .getElementById("novoEmail")
                    .value
                    .trim()
                    .toLowerCase();
            const senha =
                document
                    .getElementById("novaSenha")
                    .value;
            const confirmarSenha =
                document
                    .getElementById("confirmaSenha")
                    .value;
            // ------------------------------------------
            // VALIDA NOME
            // ------------------------------------------
            if (nome.length < 2) {
                alert(
                    "Digite um nome válido."
                );
                return;
            }
            // ------------------------------------------
            // VALIDA E-MAIL
            // ------------------------------------------
            if (!validarEmail(email)) {
                alert(
                    "Digite um e-mail válido.\n\n" +
                    "Exemplo: nome@email.com"
                );
                return;
            }
            // ------------------------------------------
            // VALIDA SENHA
            // ------------------------------------------
            if (senha.length < 6) {
                alert(
                    "A senha precisa ter pelo menos 6 caracteres."
                );
                return;
            }
            // ------------------------------------------
            // CONFIRMA SENHA
            // ------------------------------------------
            if (senha !== confirmarSenha) {
                alert(
                    "As senhas não são iguais."
                );
                return;
            }
            // ------------------------------------------
            // BUSCA USUÁRIOS
            // ------------------------------------------
            const usuarios =
                obterUsuarios();
            // ------------------------------------------
            // VERIFICA E-MAIL DUPLICADO
            // ------------------------------------------
            const emailExiste =
                usuarios.some(
                    function (usuario) {
                        return usuario.email === email;
                    }
                );
            if (emailExiste) {
                alert(
                    "Este e-mail já está cadastrado."
                );
                return;
            }
            // ------------------------------------------
            // CRIA USUÁRIO
            // ------------------------------------------
            const novoUsuario = {
                nome: nome,
                email: email,
                senha: senha
            };
            // ------------------------------------------
            // SALVA USUÁRIO
            // ------------------------------------------
            usuarios.push(novoUsuario);
            salvarUsuarios(usuarios);
            // ------------------------------------------
            // SUCESSO
            // ------------------------------------------
            alert(
                "Cadastro realizado com sucesso!"
            );
            window.location.href =
                "index.html";
        }
    );
}
// ======================================================
// HOME - VERIFICAR LOGIN
// ======================================================
const paginaProtegida =
    document.getElementById(
        "paginaProtegida"
    );
if (paginaProtegida) {
    const usuarioLogado =
        localStorage.getItem(
            "usuarioLogado"
        );
    if (!usuarioLogado) {
        window.location.href =
            "index.html";
    }
}
// ======================================================
// HOME - MOSTRAR NOME
// ======================================================
const nomeUsuario =
    document.getElementById(
        "nomeUsuario"
    );
if (nomeUsuario) {
    const nome =
        localStorage.getItem(
            "nomeUsuarioLogado"
        );
    if (nome) {
        nomeUsuario.textContent =
            nome;
    }
}
// ======================================================
// BOTÃO SAIR
// ======================================================
const btnSair =
    document.getElementById(
        "btnSair"
    );
if (btnSair) {
    btnSair.addEventListener(
        "click",
        function () {
            localStorage.removeItem(
                "usuarioLogado"
            );
            localStorage.removeItem(
                "nomeUsuarioLogado"
            );
            window.location.href =
                "index.html";
        }
    );
}