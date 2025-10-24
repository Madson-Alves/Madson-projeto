class BobileNavbar {
    constructor(menumenor, menulist, menulinks){
        this.menumenor = document.querySelector(menumenor);
        this.menulist = document.querySelector(menulist);
        this.menulinks = document.querySelectorAll(menulinks);
        this.ativaClass= "ativa";

        this.handleClick = this.handleClick.bind(this);}

        animateLinks() {
            this.menulinks.forEach((hyperlinks, index) => {
                hyperlinks.style.animation
                ? (hyperlinks.style.animation="")
                : (hyperlinks.style.animation=`menulinksFade 0.6s ease forwards 
                ${index / 7 }s`);
                
            });
        }

        handleClick() {
            this.menulist.classList.toggle(this.ativaClass);
            this.menumenor.classList.toggle(this.ativaClass);
            this.animateLinks();
        }

        addClickEvent() {
            this.menumenor.addEventListener("click", this.handleClick);
        }

        init() {
            if(this.menumenor){
                this.addClickEvent();
            }
            return this;
        }
    }

const bobileNavbar = new BobileNavbar(
    ".navmenumenor",
    ".list",
    ".list li",
);
bobileNavbar.init();

/* fiquei dias testando fazer sair a mensagem "ola".
Note que o nome tem que ser exatamente o mesmo
citado primeiro em class na linha 1
e em "new" na linha 37, o que tem nome diferente
é o nome da constante ou "const".*/

/* 
código que muda o tamanho do container

  const container = document.querySelector(".container");
  const img = new Image();
  img.src = "fundobc.jpg";

  img.onload = () => {
    function ajustarAltura() {
      const proporcaoImg = img.width / img.height;
      const proporcaoTela = window.innerWidth / window.innerHeight;

      // Se a imagem "encaixa" pela largura → sobram bordas em cima/baixo
      if (proporcaoImg > proporcaoTela) {
        container.style.height = "90vh";
      } else {
        container.style.height = "150vh";
      }
    }

    ajustarAltura();
    window.addEventListener("resize", ajustarAltura);
  };


  */