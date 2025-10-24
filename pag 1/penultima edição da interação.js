// MENU MOBILE
    class BobileNavbar {
      constructor(menumenor, menulist, menulinks){
        this.menumenor = document.querySelector(menumenor);
        this.menulist = document.querySelector(menulist);
        this.menulinks = document.querySelectorAll(menulinks);
        this.ativaClass= "ativa";
        this.handleClick = this.handleClick.bind(this);
      }
      animateLinks() {
        this.menulinks.forEach((link, index) => {
          link.style.animation
            ? (link.style.animation = "")
            : (link.style.animation = `menulinksFade 0.6s ease forwards ${index / 7}s`);
        });
      }
      handleClick() {
        this.menulist.classList.toggle(this.ativaClass);
        this.menumenor.classList.toggle(this.ativaClass);
        this.animateLinks();
      }
      addClickEvent() { this.menumenor.addEventListener('click', this.handleClick); }
      init() { if(this.menumenor){ this.addClickEvent(); } return this; }
    }
    new BobileNavbar(".navmenumenor",".list",".list li").init();

    // SISTEMA DE SOMA
    function initCart() {
      const STORAGE_KEY = 'oddsCartV1';
      const checkboxes = document.querySelectorAll('.valor-checkbox');
      const ValorDaConta = document.getElementById('ValorDaConta');
      const itensSomados = document.getElementById('itensSomados');
      if (!checkboxes.length) return;
      checkboxes.forEach(cb => cb.addEventListener('change', updateCart));

      const cart = loadCart();
      renderCart(cart);

      checkboxes.forEach(cb => {
        const itemEncontrado = cart.items.some(item => item.id === cb.id);
        cb.checked = itemEncontrado;
      });

      function loadCart() {
        try { const raw = localStorage.getItem(STORAGE_KEY); return raw ? JSON.parse(raw) : { items: [] }; }
        catch { return { items: [] }; }
      }
      function saveCart(cart) { localStorage.setItem(STORAGE_KEY, JSON.stringify(cart)); }
      function renderCart(cart) {
        const retornaItens = cart?.items || [];
        itensSomados.innerHTML = retornaItens.length
          ? `<span class="titulo-soma">Itens somados:</span><br>${retornaItens.map(obj => obj.label).join('<br>')}`
          : `<span class="titulo-soma">Itens somados:</span><br>Nenhum item selecionado.`;
        const somaValues = retornaItens.reduce((total, item) => total + Number(item.value), 0);
        ValorDaConta.textContent = somaValues.toFixed(2);
      }
      function updateCart() {
        const ItensDeCheck = Array.from(checkboxes)
          .filter(cb => cb.checked)
          .map(cb => ({ id: cb.id, label: cb.parentElement.textContent.trim(), value: cb.value }));
        const cart = { items: ItensDeCheck };
        saveCart(cart);
        renderCart(cart);
      }
    }
    initCart();

    // ----- AGENDAMENTO: select de horários + validação -----
    const dataInput = document.getElementById('dataAgendamento');
    const horaSelect = document.getElementById('horaAgendamento');
    const pagarAgoraBtn = document.querySelector('.PagarAgora');
    const linkAgendar = document.getElementById('linkAgendar');
    const agendarBtn = document.querySelector('.PagarNoLocal');

    // define data mínima = hoje
    const hoje = new Date();
    dataInput.min = hoje.toISOString().split('T')[0];

    // converte "HH:MM" para minutos
    function toMinutes(hhmm) {
      const [h, m] = hhmm.split(':').map(Number);
      return h*60 + m;
    }
    // converte minutos para "HH:MM"
    function toHHMM(mins) {
      const h = Math.floor(mins/60).toString().padStart(2,'0');
      const m = (mins % 60).toString().padStart(2,'0');
      return `${h}:${m}`;
    }

    // preenche o select com opções entre start e end (em minutos), step em minutos
    function populateTimeOptions(start='09:00', end='18:00', stepMinutes=30, minAllowedTime=null) {
      const startM = toMinutes(start);
      const endM = toMinutes(end);
      horaSelect.innerHTML = '<option value="">-- selecione --</option>';
      let firstAdded = false;
      for (let m = startM; m <= endM; m += stepMinutes) {
        // se houver minAllowedTime (em minutos), pule horários menores
        if (minAllowedTime !== null && m < minAllowedTime) continue;
        const val = toHHMM(m);
        const opt = document.createElement('option');
        opt.value = val;
        opt.textContent = val;
        horaSelect.appendChild(opt);
        firstAdded = true;
      }
      // se não sobrar opção, mostra mensagem
      if (!firstAdded) {
        horaSelect.innerHTML = '<option value="">Sem horários disponíveis</option>';
      }
    }

    // retorna minutos do próximo slot válido (arredonda pra cima ao step)
    function nextAvailableSlotFromNow(stepMinutes=30, start='09:00') {
      const now = new Date();
      const curMinutes = now.getHours()*60 + now.getMinutes();
      const startM = toMinutes(start);
      const remainder = curMinutes % stepMinutes;
      const roundedUp = remainder === 0 ? curMinutes : (curMinutes - remainder + stepMinutes);
      // se roundedUp < start do dia, usa start
      return Math.max(roundedUp, startM);
    }

    // inicializa o select: se data vazia, preenche full range; se data == hoje, remove horários passados
    function refreshTimeOptionsForSelectedDate() {
      const selected = dataInput.value;
      if (!selected) {
        populateTimeOptions('09:00','18:00',30,null);
        return;
      }
      const selectedDate = new Date(selected + 'T00:00');
      const hojeDate = new Date();
      // zerar horas para comparar só datas
      selectedDate.setHours(0,0,0,0);
      hojeDate.setHours(0,0,0,0);
      if (selectedDate.getTime() === hojeDate.getTime()) {
        // para hoje: remover horários passados (usar próximo slot)
        const minSlot = nextAvailableSlotFromNow(30,'09:00');
        populateTimeOptions('09:00','18:00',30,minSlot);
      } else {
        // dia futuro: full range
        populateTimeOptions('09:00','18:00',30,null);
      }
    }

    // inicializa
    refreshTimeOptionsForSelectedDate();

    // quando data mudar, atualiza horários
    dataInput.addEventListener('change', refreshTimeOptionsForSelectedDate);

    // validação antes de prosseguir (retorna true se ok)
    function validarAgendamento() {
      if (!dataInput.value) { alert('Escolha uma data para agendar.'); return false; }
      if (!horaSelect.value) { alert('Escolha um horário válido entre 09:00 e 18:00.'); return false; }
      return true;
    }

    // Pagar agora: valida antes de prosseguir (aqui só exemplo com alert)
    pagarAgoraBtn.addEventListener('click', () => {
      if (!validarAgendamento()) return;
      // <-- aqui você integra o fluxo de pagamento real -->
      alert(`Agendado em ${dataInput.value} às ${horaSelect.value}. Prosseguir para pagamento.`);
    });

    // Agendar (link): prevenir navegação se invalidar
    linkAgendar.addEventListener('click', function(e) {
      if (!validarAgendamento()) {
        e.preventDefault();
      } else {
        // se quiser, podemos adicionar a data/hora ao localStorage para página dados.html ler depois
        const ag = { data: dataInput.value, hora: horaSelect.value };
        localStorage.setItem('agendamentoTemp', JSON.stringify(ag));
        // segue para dados.html (link padrão)
      }
    });

    // Se quiser limpar seleção caso a data seja alterada para um dia sem horários:
    horaSelect.addEventListener('change', () => {
      // nada específico aqui, apenas mantém a escolha
    });

