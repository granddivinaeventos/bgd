// 1. BACKGROUND SLIDER DINÂMICO (Desktop vs Mobile)
document.addEventListener('DOMContentLoaded', () => {
    preloadGalleryAssets();
    const bgSlider = document.getElementById('bg-slider');
    const isMobile = window.innerWidth <= 768;
    const totalPhotos = 17;
    const overlay = document.querySelector('.overlay');

    // Injeta as 17 imagens dinamicamente
    for (let i = 1; i <= totalPhotos; i++) {
        const img = document.createElement('img');
        
        // "mobile X.jpeg", se for desktop busca "foto X.jpeg"
        // Note: padrão de espaço "foto 2"
        const fileName = isMobile ? `mobile ${i}.jpeg` : (i === 1 ? `foto1.jpeg` : `foto ${i}.jpeg`);
        
        img.src = `assets/${fileName}`;
        if (i === 1) img.classList.add('active');
        img.alt = `Background ${i}`;
        
        // Insere a imagem antes do overlay
        bgSlider.insertBefore(img, overlay);

    }
    
    // Lógica de rotação das fotos
    const slides = bgSlider.querySelectorAll('img');
    let currentSlide = 0;
    
    if (slides.length > 0) {
        setInterval(() => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }, 4000);
    }
});
// FECHAR AO CLICAR FORA (Movido para fora do loop das imagens)
window.onclick = function(event) {
    const modal = document.getElementById('gallery-modal');
    if (event.target === modal) {
        closeGallery();
    }
};

// 2. DADOS DA GALERIA (Fotos e Vídeos)
const galleryData = {
    'espacos': [
        { img: 'assets/panmeireles.mp4', 
         title: 'Salão varanda Meireles', 
         cap: 'Capacidade para até 200 pessoas', 
         desc: `Corporativos (Treinamentos e Confraternizações)
         Sociais (Recepção de Casamento & Aniversário)

Estrutura para receber decoração e música
A partir de 50 Pessoas (Segunda a Quinta)
A partir de 80 Pessoas (Sexta a Domingo) ` },
        { img: 'assets/rooftop.mp4', 
         title: 'Rooftop meireles', cap: 'Capacidade para até 75 pessoas', 
         desc: `Estrutura para receber decoração e música
         
         A partir de 40 pessoas (Segunda a Quinta)
         A partir de 50 pessoas (Sexta a Domingo)` },

        { img: 'assets/divina 1.jpeg', 
         title: 'Salão divina meireles', cap: 'Capacidade para até 75 pessoas', 
         desc: `Estrutura para receber decoração e música
         
         A partir de 50 pessoas (Todos os dias)` },

         { img: 'assets/granddivina.mp4', 
         title: `Salão Grand Divina
(Cid. Funcionários)`, cap: 'Capacidade para até 100 pessoas.',
         desc: `Estrutura para receber decoração e música

• Jardim de Inverno | Áreas Instagramáveis

• Caramanchão | Iluminação de Quermesse | Fonte

A partir de 50 Pessoas (Todos os dias)`},
    ],
    'corporativo': [
        { img: 'assets/feedback 1.png', title: 'Casamento 1', desc: 'Descrição.' },
        { img: 'assets/feedback 2.png', title: 'Casamento 1', desc: 'Descrição.' },
        { img: 'assets/feedback 3.jpg', title: 'Casamento 1', desc: 'Descrição.' },
        { img: 'assets/feedback 4.png', title: 'Casamento 1', desc: 'Descrição.' }
    ],
    'social': [
        { img: 'assets/bianchi2025.mp4', title: 'Eventos corporativos', desc: 'No 𝐆𝐫𝐚𝐧𝐝 𝐃𝐢𝐯𝐢𝐧𝐚 𝐄𝐯𝐞𝐧𝐭𝐨𝐬 dispomos de espaços modernos com capacidade para até 200 pessoas,  ideal para eventos corporativos: reuniões, treinamentos, jantar de negócios, palestras e confraternizações de empresa.  Nosso experiente time tem atendimento personalizado o que garante um serviço de alto padrão. Para completar nossa gastronomia é um dos grandes diferenciais com cardápios exclusivos e adaptados a necessidade do seu evento, unindo sabor e qualidade elevando o nível de seu evento e garantindo o destaque que ele merece.' },
        { img: 'assets/sociais.mp4', title: 'Eventos Sociais', desc: 'O Grand Divina Eventos é a escolha certa para quem deseja realizar eventos sociais com charme e excelência. Ideal para aniversários, recepções de batizado, festas de 15 anos e outras celebrações especiais, o espaço oferece uma estrutura completa, atendimento atencioso e uma gastronomia de qualidade, pensada para encantar os convidados e tornar cada evento realmente inesquecível.' },
    ]
};

let currentCategory = '';
let currentIndex = 0;

// Função para tocar o áudio após a primeira interação
function startAudio() {
    const audio = document.getElementById('bg-audio');
    if (audio) {
        audio.play().then(() => {
            // Se o áudio começar, removemos os ouvintes para não rodar de novo
            document.removeEventListener('click', startAudio);
            document.removeEventListener('touchstart', startAudio);
            document.removeEventListener('scroll', startAudio);
        }).catch(error => {
            console.log("Autoplay bloqueado pelo navegador. Aguardando interação.");
        });
    }
}

// Ouve cliques, toques ou rolagem para destravar o som
document.addEventListener('click', startAudio);
document.addEventListener('touchstart', startAudio);
document.addEventListener('scroll', startAudio);

// Elementos do DOM
const modal = document.getElementById('gallery-modal');
const modalTitle = document.getElementById('modal-title');
const modalDesc = document.getElementById('modal-desc');
const modalCta = document.getElementById('modal-cta');

// 3. FUNÇÕES DA GALERIA

function openGallery(category) {
    if (!galleryData[category]) return;
    currentCategory = category;
    currentIndex = 0;
    
    // Modal
    modal.style.display = 'flex';
    setTimeout(() => { modal.classList.add('show'); }, 10);
    
    // Botão voltar
    history.pushState({ modalOpen: true }, '');

    updateSlide(); 
}

function updateSlide() {
    const modalContent = document.querySelector('.modal-content');
    const imageContainer = document.querySelector('.slide-image');
    const item = galleryData[currentCategory][currentIndex];
    const modalCap = document.getElementById('modal-cap');
    const partnersContainer = document.getElementById('partners-logos');

    if (!imageContainer) return;

    // --- NOVO: LÓGICA DE EXCEÇÃO PARA FEEDBACKS (Casamentos) ---
    // Verificamos se a categoria é 'corporativo' (que é o botão de casamentos no seu HTML)
    if (currentCategory === 'corporativo') {
        modalContent.classList.add('full-gallery');
    } else {
        modalContent.classList.remove('full-gallery');
    }

    // 1. LIMPEZA IMEDIATA
    imageContainer.innerHTML = '';

    // 2. RENDERIZAÇÃO DA MÍDIA
    if (item.img.toLowerCase().endsWith('.mp4')) {
        const video = document.createElement('video');
        video.src = item.img;
        video.autoplay = true;
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        video.setAttribute('preload', 'auto');
        imageContainer.appendChild(video);
    } else {
        const img = document.createElement('img');
        img.src = item.img;
        imageContainer.appendChild(img);
    }

    // 3. TEXTOS (Só atualiza se não for a galeria full para evitar erros)
    if (currentCategory !== 'corporativo') {
        if (modalCap) {
            modalCap.textContent = item.cap || '';
            modalCap.style.display = (currentCategory === 'espacos' && item.cap) ? 'block' : 'none';
        }

        modalTitle.innerText = item.title;
        modalDesc.innerText = item.desc;
        
        const text = `Olá, gostei do ${item.title} que vi no site!`;
        modalCta.href = `https://wa.me/5585996377401?text=${encodeURIComponent(text)}`;
        modalCta.innerHTML = (currentCategory === 'espacos') ? 'Fale Conosco' : 'Faça seu Evento';
    }

    // 4. LOGOS DOS PARCEIROS (Apenas para o PRIMEIRO vídeo da galeria de eventos)
    if (partnersContainer) {
        // CONDIÇÃO: Precisa ser a categoria 'social' E o primeiro slide (index 0)
        // Nota: No seu objeto galleryData, o vídeo corporativo é o index 0 da categoria 'social'
        if (currentCategory === 'social' && currentIndex === 0) {
            const listaLogos = ['logo 1.png', 'logo 2.png', 'logo 3.png', 'logo 4.png', 'logo 5.png', 'logo 6.png', 'logo 7.png', 'logo 8.png', 'logo 10.png'];
            let logoHTML = '<span class="partners-title">Nossos clientes</span><div class="logo-track">';
            
            [...listaLogos, ...listaLogos].forEach(nomeArquivo => {
                logoHTML += `<img src="assets/${nomeArquivo}" alt="Parceiro" class="partners-img">`;
            });
            
            logoHTML += '</div>';
            partnersContainer.innerHTML = logoHTML;
            partnersContainer.style.display = 'block';
        } else {
            // Se for o segundo vídeo (currentIndex 1) ou outra categoria, esconde tudo
            partnersContainer.innerHTML = '';
            partnersContainer.style.display = 'none';
        }
    }
  // 5. TEXTOS E BOTÃO (Ajustado com o Ícone do WhatsApp)
    modalTitle.innerText = item.title;
    modalDesc.innerText = item.desc;
    
    const text = `Olá, gostei do ${item.title} que vi no site!`;
    modalCta.href = `https://wa.me/5585996377401?text=${encodeURIComponent(text)}`;
    
    // Aqui injetamos o ícone junto com o texto conforme a categoria
    const iconeWhats = '<i class="fa fa-whatsapp" style="margin-left: 8px;"></i>';
    
    if (currentCategory === 'espacos') {
        modalCta.innerHTML = `Fale Conosco ${iconeWhats}`;
    } else {
        modalCta.innerHTML = `Faça seu Evento ${iconeWhats}`;
    }
}

function closeGallery() {
    const modal = document.getElementById('gallery-modal');
    modal.classList.remove('show');
    
    // Aguarda a animação de fade-out do modal terminar para esconder
    setTimeout(() => { 
        modal.style.display = 'none'; 
        // Limpa a mídia ao fechar para não continuar tocando áudio/vídeo em background
        document.querySelector('.slide-image').innerHTML = '';
    }, 800);

    if (history.state && history.state.modalOpen) {
        history.back();
    }
}
// The soul of my code, my inspiration. Cla

function changeSlide(direction) {
    const imgContainer = document.querySelector('.slide-image');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    const modalCap = document.getElementById('modal-cap');
    
    // 1. Inicia o Fade Out (Apaga imagem e textos)
    if (imgContainer) imgContainer.classList.add('fade-out');
    if (modalTitle) modalTitle.style.opacity = '0';
    if (modalDesc) modalDesc.style.opacity = '0';
    if (modalCap) modalCap.style.opacity = '0';

    // 2. Espera o tempo da animação (800ms) para trocar o conteúdo
    setTimeout(() => {
        const items = galleryData[currentCategory];
        currentIndex = (currentIndex + direction + items.length) % items.length;
        
        updateSlide(); // Troca os dados (Título, Desc, Link)

        // 3. Inicia o Fade In (Acende tudo com os dados novos)
        setTimeout(() => {
            if (imgContainer) imgContainer.classList.remove('fade-out');
            if (modalTitle) modalTitle.style.opacity = '1';
            if (modalDesc) modalDesc.style.opacity = '1';
            if (modalCap) modalCap.style.opacity = '1';
        }, 50); 
        
    }, 800); 
}

// --- NOVO: CAPTURAR O BOTÃO VOLTAR DO CELULAR ---
window.onpopstate = function(event) {
    // Se o usuário apertar voltar e o modal estiver visível, apenas fechamos o modal
    if (modal.classList.contains('show')) {
        modal.classList.remove('show');
        setTimeout(() => { modal.style.display = 'none'; }, 400);
    }
};

function preloadGalleryAssets() {
    // 1. Preload de Imagens do Background (As 17 fotos)
    const totalPhotos = 17;
    const isMobile = window.innerWidth <= 768;
    for (let i = 1; i <= totalPhotos; i++) {
        const fileName = isMobile ? `mobile ${i}.jpeg` : (i === 1 ? `foto1.jpeg` : `foto ${i}.jpeg`);
        const img = new Image();
        img.src = `assets/${fileName}`;
    }

    // 2. Preload de Itens da Galeria (Vídeos e Imagens dos Modais)
    Object.keys(galleryData).forEach(category => {
        galleryData[category].forEach(item => {
            const path = item.img.toLowerCase();
            
            if (path.endsWith('.mp4')) {
                // Cria um elemento de vídeo invisível para forçar o browser a baixar o arquivo todo
                const videoPreload = document.createElement('video');
                videoPreload.src = item.img;
                videoPreload.preload = 'auto'; 
                videoPreload.load(); // Força o início do download
            } else {
                const imgPreload = new Image();
                imgPreload.src = item.img;
            }
        });
    });

    // 3. Preload das Logos de Parceiros
    const listaLogos = ['logo 1.png', 'logo 2.png', 'logo 3.png', 'logo 4.png', 'logo 5.png', 'logo 6.png', 'logo 7.png', 'logo 8.png', 'logo 10.png'];
    listaLogos.forEach(logo => {
        const img = new Image();
        img.src = `assets/${logo}`;
    });

    console.log("carregado!.");
}

// Ativar setas do teclado e tecla ESC
document.addEventListener('keydown', (e) => {
    const modal = document.getElementById('gallery-modal');
    
    // Verifica se o modal existe e se está visível (com a classe 'show')
    if (modal && modal.classList.contains('show')) {
        if (e.key === "ArrowLeft") {
            changeSlide(-1); // Seta Esquerda volta
        } else if (e.key === "ArrowRight") {
            changeSlide(1);  // Seta Direita avança
        } else if (e.key === "Escape") {
            closeGallery();  // Tecla Esc fecha o modal
        }
    }
});
