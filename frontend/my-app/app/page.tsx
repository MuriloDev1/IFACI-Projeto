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
            <p className="mt-2 max-w-2xl text-slate-400">
              Os dados do Node-RED chegam ao backend e são exibidos no frontend
              a cada 5 segundos.
            </p>
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
