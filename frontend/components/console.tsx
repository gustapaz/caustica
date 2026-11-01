import { Component, State, h, Fragment } from "@stencil/core";
import { client } from "../src/client";
const api = client("caustica");
@Component({ tag: "caustica-console", shadow: false })
export class Console {
  @State() input: any;
  @State() catalog: any;
  @State() result: any;
  @State() title = "Estudo de luz";
  @State() busy = true;
  @State() status = "Preparando a bancada…";
  @State() error = "";
  @State() share = "";
  @State() version = 0;
  confirmed = "";
  async componentWillLoad() {
    try {
      this.catalog = await api.catalog();
      const id = new URL(location.href).searchParams.get("record");
      if (id) await this.open(id);
      else {
        this.input = { ...this.catalog.default_input };
        await this.calculate();
      }
    } catch (e) {
      this.problem(e);
    } finally {
      this.busy = false;
    }
  }
  problem(e: unknown) {
    this.error = e instanceof Error ? e.message : "O serviço não respondeu.";
    this.status = "Não foi possível concluir.";
  }
  async calculate() {
    if (!this.input) return;
    this.busy = true;
    this.error = "";
    this.status = "Traçando a luz…";
    try {
      this.result = await api.compute(this.input);
      this.confirmed = JSON.stringify(this.input);
      window.dispatchEvent(
        new CustomEvent("caustica:result", { detail: this.result }),
      );
      this.status = "Espectro calculado no servidor.";
    } catch (e) {
      this.problem(e);
    } finally {
      this.busy = false;
    }
  }
  change(key: string, value: number) {
    this.input = { ...this.input, [key]: value };
    this.status = "Parâmetros alterados. Recalcule o trajeto.";
  }
  async open(id: string) {
    this.busy = true;
    this.error = "";
    try {
      const r = await api.open(id);
      this.input = { ...r.input };
      this.title = r.title;
      this.result = r.result;
      this.confirmed = JSON.stringify(this.input);
      this.version++;
      window.dispatchEvent(
        new CustomEvent("caustica:result", { detail: this.result }),
      );
      this.status = api.owns
        ? "Estudo relido do banco."
        : "Estudo compartilhado: leitura e cópia disponíveis.";
      this.share = r.published ? location.origin + "/?record=" + r.id : "";
    } catch (e) {
      this.problem(e);
    } finally {
      this.busy = false;
    }
  }
  async save() {
    if (this.confirmed !== JSON.stringify(this.input)) {
      this.error = "Trace os raios antes de guardar a nova configuração.";
      return;
    }
    this.busy = true;
    this.error = "";
    try {
      const r = await api.save(this.title, this.input);
      this.version++;
      this.status = "Estudo guardado · revisão " + r.revision;
    } catch (e) {
      this.problem(e);
    } finally {
      this.busy = false;
    }
  }
  async publish() {
    this.busy = true;
    this.error = "";
    try {
      if (!api.current) throw new Error("Guarde o estudo primeiro.");
      if (
        JSON.stringify(api.current.input) !== JSON.stringify(this.input) ||
        api.current.title !== this.title
      )
        throw new Error("Guarde as alterações antes de criar o link.");
      this.share = await api.share(!api.current.published);
      if (!api.current.published) this.share = "";
      this.version++;
      this.status = this.share
        ? "Link de leitura criado."
        : "O estudo voltou a ser privado.";
    } catch (e) {
      this.problem(e);
    } finally {
      this.busy = false;
    }
  }
  async download() {
    try {
      await api.export();
      this.status = "Trajetos da revisão salva exportados.";
    } catch (e) {
      this.problem(e);
    }
  }
  render() {
    return (
      <div class="optics-console">
        <div class="console-heading">
          <span>02 / BANCADA ÓPTICA</span>
          <h2>
            Faça a luz
            <br />
            <em>mudar de ideia.</em>
          </h2>
          <p>
            Gire o prisma. Mude o índice.
            <br />
            Veja a diferença em cada caminho.
          </p>
        </div>
        <div class="instruments">
          {this.catalog && (
            <>
              <div class="preset-row">
                {this.catalog.presets.map((p: any) => (
                  <button
                    disabled={this.busy}
                    onClick={() => {
                      this.input = { ...p.input };
                      void this.calculate();
                    }}
                  >
                    {p.name} ↗
                  </button>
                ))}
              </div>
              <div class="knobs">
                {[
                  {
                    key: "rotation",
                    name: "Rotação do prisma",
                    min: -60,
                    max: 60,
                    step: 1,
                    unit: "°",
                  },
                  {
                    key: "incidence",
                    name: "Ângulo do feixe",
                    min: -30,
                    max: 30,
                    step: 1,
                    unit: "°",
                  },
                  {
                    key: "offset",
                    name: "Deslocamento",
                    min: -60,
                    max: 60,
                    step: 1,
                    unit: "",
                  },
                  {
                    key: "index",
                    name: "Índice base",
                    min: 1.3,
                    max: 1.9,
                    step: 0.01,
                    unit: "",
                  },
                  {
                    key: "dispersion",
                    name: "Dispersão",
                    min: 0,
                    max: 100,
                    step: 1,
                    unit: "%",
                  },
                ].map((c) => (
                  <label>
                    <span>
                      {c.name}
                      <output>
                        {this.input?.[c.key]}
                        {c.unit}
                      </output>
                    </span>
                    <input
                      aria-label={c.name}
                      type="range"
                      min={c.min}
                      max={c.max}
                      step={c.step}
                      value={this.input?.[c.key]}
                      onInput={(e: Event) =>
                        this.change(
                          c.key,
                          +(e.target as HTMLInputElement).value,
                        )
                      }
                    />
                  </label>
                ))}
              </div>
              <button
                class="trace-button"
                disabled={this.busy}
                onClick={() => void this.calculate()}
              >
                {this.busy ? "Traçando…" : "Traçar os raios ↗"}
              </button>
            </>
          )}
          <div class="console-status">
            <p role="status">{this.error || this.status}</p>
            {this.error && (
              <button
                onClick={() =>
                  void (this.catalog
                    ? this.calculate()
                    : this.componentWillLoad())
                }
              >
                Tentar novamente
              </button>
            )}
          </div>
          {this.result && (
            <div class="spectrum-readout">
              <span>
                {this.result.spread_deg.toFixed(2)}
                <small>° DE ABERTURA</small>
              </span>
              <div>
                {this.result.rays.map((r: any) => (
                  <p style={{ "--ray": r.color }}>
                    <i />
                    {r.wavelength_nm} nm <b>{r.index.toFixed(3)}</b>
                  </p>
                ))}
              </div>
            </div>
          )}
          <div class="archive">
            <label>
              Nome do estudo
              <input
                aria-label="Nome do estudo"
                maxlength={48}
                value={this.title}
                onInput={(e: Event) =>
                  (this.title = (e.target as HTMLInputElement).value)
                }
              />
            </label>
            <div class="archive-actions">
              <button
                disabled={this.busy || !this.result}
                onClick={() => void this.save()}
              >
                {api.current && api.owns
                  ? "Salvar alterações"
                  : "Guardar estudo"}{" "}
                ↗
              </button>
              {api.current && (
                <>
                  <button
                    disabled={this.busy}
                    onClick={() => void this.open(api.current!.id)}
                  >
                    Reler
                  </button>
                  <button onClick={() => void this.download()}>
                    Exportar JSON ↓
                  </button>
                  {api.owns && (
                    <button
                      disabled={this.busy}
                      onClick={() => void this.publish()}
                    >
                      {api.current.published ? "Encerrar link" : "Criar link"}
                    </button>
                  )}
                  <button
                    onClick={() => {
                      api.fresh();
                      this.share = "";
                      this.version++;
                      this.status = "Novo estudo, sem alterar o anterior.";
                    }}
                  >
                    Novo estudo
                  </button>
                </>
              )}
            </div>
            {this.share && (
              <a
                class="share-url"
                href={this.share}
                target="_blank"
                rel="noreferrer"
              >
                Abrir estudo compartilhado ↗
              </a>
            )}
            <details>
              <summary>Arquivo desta aba · {api.archive().length}</summary>
              {api.archive().map((r) => (
                <button
                  class="archive-item"
                  onClick={() => void this.open(r.id)}
                >
                  {r.title} ↗
                </button>
              ))}
            </details>
            <small>
              Estudos sintéticos por 7 dias. Acesso de edição somente nesta aba.
              O link permite leitura, nunca edição. Exportação da revisão salva.
            </small>
          </div>
        </div>
      </div>
    );
  }
}
