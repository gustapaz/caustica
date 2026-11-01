import ClientBoot from "./client-boot";
export default function Home() {
  return (
    <>
      <a className="skip" href="#studio">
        Ir para a bancada
      </a>
      <header>
        <a href="/" className="logo">
          CÁUSTICA<span>ESTUDOS ÓPTICOS</span>
        </a>
        <nav>
          <a href="#manifesto">A matéria</a>
          <a href="#studio">A bancada ↗</a>
        </nav>
      </header>
      <main>
        <section className="light-stage">
          <div className="edition">
            OBSERVATÓRIO DA LUZ
            <br />
            EXPERIMENTO Nº 001
          </div>
          <h1>
            Um raio.
            <br />
            <em>
              Todos os
              <br />
              caminhos.
            </em>
          </h1>
          <div className="optical-canvas" aria-hidden="true">
            <canvas id="glass" />
            <canvas id="beams" />
          </div>
          <span className="axis left">430 nm</span>
          <span className="axis right">680 nm</span>
          <div className="hero-bottom">
            <p>
              A luz não escolhe um caminho.
              <br />A matéria oferece possibilidades.
            </p>
            <a href="#studio">
              Abrir a bancada <b>↗</b>
            </a>
          </div>
          <div className="spectrum-strip" aria-hidden="true" />
        </section>
        <section className="matter" id="manifesto">
          <div className="matter-image">
            <img
              src="/media/prism.webp"
              alt="Prisma de vidro iluminado em uma composição real de luz e sombra"
              width="1400"
              height="933"
              loading="lazy"
            />
          </div>
          <div className="matter-copy" data-reveal>
            <span>01 / ENTRE DOIS MEIOS</span>
            <h2>
              A mesma luz.
              <br />
              Outra
              <br />
              <em>direção.</em>
            </h2>
            <p>
              Uma superfície muda tudo. Entre o ar e o vidro, cada cor encontra
              seu próprio desvio.
            </p>
            <p>
              Observe os trajetos. Alterne o ângulo. Descubra o ponto em que
              atravessar deixa de ser possível — e a luz volta.
            </p>
            <a href="#studio">Experimente o desvio ↓</a>
          </div>
        </section>
        <section id="studio">
          <div id="console-root">
            <p>Preparando a bancada óptica…</p>
          </div>
        </section>
        <section className="footnote">
          <span>UM MODELO, NÃO UM MATERIAL FÍSICO</span>
          <p>
            Refração e reflexão calculadas em duas dimensões. Índices
            parametrizados para experimentar; não são especificações de um vidro
            real. Até oito interações por raio.
          </p>
        </section>
      </main>
      <footer>
        <a className="logo" href="/">
          CÁUSTICA
        </a>
        <p>Uma experiência de Gustavo Paz.</p>
        <div>
          <a href="/api-docs.html">Como funciona ↗</a>
          <a href="https://github.com/gustapaz/caustica">Código e créditos ↗</a>
        </div>
        <small>Fotografia: Design Bits / Pexels · Dados sintéticos.</small>
      </footer>
      <button id="motion-toggle" aria-pressed="false">
        Pausar movimento
      </button>
      <ClientBoot />
    </>
  );
}
