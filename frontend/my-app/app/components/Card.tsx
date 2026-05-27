interface ICard {
  title?: string;
  size: keyof typeof tamanhos;
  style: keyof typeof estilos;
  children?: React.ReactNode;
}

const tamanhos = {
  sm: "w-full h-auto",
  md: "w-full h-auto",
} as const;

const estilos = {
  white: "bg-slate-800 text-white",
  gray: "bg-slate-900 text-slate-100",
} as const;

export default function Card({ title, size, style, children }: ICard) {
  const tamanhoAtivo = tamanhos[size];
  const estiloAtivo = estilos[style];

  return (
    <div
      className={`flex flex-col justify-between gap-4 rounded-3xl border border-slate-700 p-6 shadow-xl shadow-slate-950/40 ${tamanhoAtivo} ${estiloAtivo}`}
    >
      <div>
        <h2 className="text-xl font-black tracking-tight text-white">
          {title}
        </h2>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}
