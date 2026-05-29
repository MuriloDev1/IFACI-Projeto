"use client";

import { useEffect, useState } from "react";
import Card from "./components/Card";
import Botao from "./components/Botao";

type SensorData = {
  id: number;
  Sensor?: string;
  Codigo?: string;
  temp?: number | string;
  umid?: number | string;
  pressao?: number | string;
  status_f?: boolean | string;
  trava_seg?: boolean | string;
  createdAt?: string;
};

const defaultSensores: SensorData[] = [];

export default function Home() {
  const [dadosBackend, setDadosBackend] =
    useState<SensorData[]>(defaultSensores);
  const [ultimaAtualizacao, setUltimaAtualizacao] = useState("");
  const [novoSensor, setNovoSensor] = useState("");
  const [novoCodigo, setNovoCodigo] = useState("");
  const [novaTemp, setNovaTemp] = useState("");
  const [novaUmid, setNovaUmid] = useState("");
  const [novaPressao, setNovaPressao] = useState("");
  const [novoStatusAtivo, setNovoStatusAtivo] = useState(true);
  const [novaTravaAtiva, setNovaTravaAtiva] = useState(false);

  const pegaDados = async () => {
    try {
      const resposta = await fetch("http://localhost:8080/iot");
      const resposta_JSON = await resposta.json();
      setDadosBackend(
        Array.isArray(resposta_JSON) ? resposta_JSON : [resposta_JSON],
      );
      setUltimaAtualizacao(new Date().toLocaleTimeString("pt-BR"));
    } catch (error) {
      console.error("Falha na requisição:", error);
    }
  };

  const deletaTudo = async () => {
    try {
      await fetch("http://localhost:8080/destroy", {
        method: "DELETE",
      });
      setDadosBackend([]);
      setUltimaAtualizacao(new Date().toLocaleTimeString("pt-BR"));
      alert("Dados excluídos com sucesso!");
    } catch (error) {
      console.error("Falha na requisição:", error);
    }
  };

  const adicionarSensor = async () => {
    try {
      const payload = {
        Sensor: novoSensor || `Sensor ${dadosBackend.length + 1}`,
        Codigo: novoCodigo || `${dadosBackend.length + 1}`,
        temp: novaTemp !== "" ? Number(novaTemp) : null,
        umid: novaUmid !== "" ? Number(novaUmid) : null,
        pressao: novaPressao !== "" ? Number(novaPressao) : null,
        status_f: novoStatusAtivo,
        trava_seg: novaTravaAtiva,
      };

      const resposta = await fetch("http://localhost:8080/newdata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!resposta.ok) {
        throw new Error("Não foi possível adicionar o sensor.");
      }

      setNovoSensor("");
      setNovoCodigo("");
      setNovaTemp("");
      setNovaUmid("");
      setNovaPressao("");
      setNovoStatusAtivo(true);
      setNovaTravaAtiva(false);

      await pegaDados();
      alert("Sensor adicionado com sucesso!");
    } catch (error) {
      console.error("Falha ao adicionar sensor:", error);
      alert("Não foi possível adicionar o sensor. Verifique o backend.");
    }
  };

  useEffect(() => {
    pegaDados();
    const interval = setInterval(pegaDados, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 px-6 py-8">
      <section className="mx-auto max-w-6xl space-y-8 rounded-3xl border border-slate-700 bg-slate-900/95 p-8 shadow-2xl shadow-slate-950/40">
        <div className="flex flex-col gap-6 rounded-3xl border border-slate-700 bg-slate-950/80 p-6 shadow-inner shadow-slate-950/10 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-cyan-300/80">
              Supervisório Web
            </p>
            <h1 className="mt-3 text-4xl font-black text-white">
              Painel de Sensores IoT
            </h1>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Botao
              estilo="confirmar"
              onClick={pegaDados}
              nome="Atualizar Agora"
            />
            <Botao estilo="deletar" onClick={deletaTudo} nome="Limpar Dados" />
          </div>
        </div>

        <div className="grid gap-4 rounded-3xl border border-slate-700 bg-slate-950/80 p-5 text-slate-300 shadow-inner shadow-slate-950/10">
          <div className="grid gap-4 justify-items-center">
            <div className="w-full max-w-3xl space-y-3 rounded-3xl border border-slate-700 bg-slate-950/80 p-5">
              <p className="text-sm uppercase tracking-[0.32em] text-cyan-300/80">
                Novo Sensor
              </p>
              <div className="grid gap-3">
                <label className="text-sm text-slate-300">Nome do sensor</label>
                <input
                  value={novoSensor}
                  onChange={(event) => setNovoSensor(event.target.value)}
                  placeholder="Ex: Sensor de Temperatura"
                  className="rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-slate-100 outline-none focus:border-cyan-400"
                />
                <label className="text-sm text-slate-300">Código</label>
                <input
                  value={novoCodigo}
                  onChange={(event) => setNovoCodigo(event.target.value)}
                  placeholder="Ex: T-001"
                  className="rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-slate-100 outline-none focus:border-cyan-400"
                />
                <div className="grid gap-3 md:grid-cols-3">
                  <div>
                    <label className="text-sm text-slate-300">Temp (°C)</label>
                    <input
                      value={novaTemp}
                      onChange={(event) => setNovaTemp(event.target.value)}
                      placeholder="25"
                      className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-slate-100 outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-slate-300">Umid (%)</label>
                    <input
                      value={novaUmid}
                      onChange={(event) => setNovaUmid(event.target.value)}
                      placeholder="60"
                      className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-slate-100 outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-slate-300">Pressão</label>
                    <input
                      value={novaPressao}
                      onChange={(event) => setNovaPressao(event.target.value)}
                      placeholder="1013"
                      className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-slate-100 outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <label className="flex items-center gap-2 text-slate-300">
                    <input
                      type="checkbox"
                      checked={novoStatusAtivo}
                      onChange={(event) =>
                        setNovoStatusAtivo(event.target.checked)
                      }
                      className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-cyan-400"
                    />
                    Ativo
                  </label>
                  <label className="flex items-center gap-2 text-slate-300">
                    <input
                      type="checkbox"
                      checked={novaTravaAtiva}
                      onChange={(event) =>
                        setNovaTravaAtiva(event.target.checked)
                      }
                      className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-amber-400"
                    />
                    Trava ativa
                  </label>
                </div>
                <Botao
                  estilo="confirmar"
                  onClick={adicionarSensor}
                  nome="Adicionar Sensor"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 rounded-3xl border border-slate-700 bg-slate-950/80 p-5 text-slate-300 shadow-inner shadow-slate-950/10 md:grid-cols-3">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-cyan-300/80">
              Sensores conectados
            </p>
            <p className="mt-3 text-3xl font-black text-white">
              {dadosBackend.length}
            </p>
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-cyan-300/80">
              Última atualização
            </p>
            <p className="mt-3 text-3xl font-black text-white">
              {ultimaAtualizacao || "---"}
            </p>
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-cyan-300/80">
              Status da conexão
            </p>
            <p className="mt-3 text-3xl font-black text-emerald-400">Online</p>
          </div>
        </div>

        {dadosBackend.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-600 bg-slate-950/50 p-10 text-center text-slate-400">
            Nenhum sensor foi encontrado. Envie dados via Node-RED usando POST
            /newdata ou /iot.
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {dadosBackend.map((item) => {
              const statusAtivo =
                item.status_f === true || item.status_f === "true";
              const travaAtiva =
                item.trava_seg === true || item.trava_seg === "true";

              return (
                <Card
                  key={item.id}
                  size="md"
                  style={statusAtivo ? "white" : "gray"}
                  title={item.Sensor ?? `Sensor ${item.Codigo}`}
                >
                  <div className="space-y-4">
                    <div className="rounded-3xl bg-slate-950/80 p-4">
                      <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
                        Código
                      </p>
                      <p className="mt-2 text-xl font-bold text-emerald-400">
                        {item.Codigo ?? "—"}
                      </p>
                    </div>
                    <div className="grid gap-2">
                      <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
                        Temperatura
                      </p>
                      <p className="text-lg font-semibold text-white">
                        {item.temp ?? "—"}°C
                      </p>
                    </div>
                    <div className="grid gap-2">
                      <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
                        Umidade
                      </p>
                      <p className="text-lg font-semibold text-white">
                        {item.umid ?? "—"}%
                      </p>
                    </div>
                    <div className="grid gap-2">
                      <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
                        Pressão
                      </p>
                      <p className="text-lg font-semibold text-white">
                        {item.pressao ?? "—"} bar
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${statusAtivo ? "bg-emerald-500/15 text-emerald-200" : "bg-rose-500/15 text-rose-200"}`}
                      >
                        {statusAtivo ? "Ativo" : "Inativo"}
                      </span>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${travaAtiva ? "bg-amber-500/15 text-amber-200" : "bg-slate-600/15 text-slate-300"}`}
                      >
                        {travaAtiva ? "Trava ativa" : "Trava liberada"}
                      </span>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
