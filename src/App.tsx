import logoNlwExpert from "./assets/logo-nlw-expert.svg";
import { NewNoteCard } from "./components/New-Note-Card";
import { NoteCard } from "./components/Note-Card";

const note = {
	date: new Date(),
	content: "Aqui está o conteúdo da sua nota!",
};

export function App() {
	return (
		<div className="mx-auto max-w-6xl my-12 space-y-6">
			<img src={logoNlwExpert} alt="NLW Expert" className="max-h-[5vh]" />
			<form className="w-full my-6">
				<input
					type="text"
					placeholder="Busque em suas notas..."
					className="w-full bg-transparent text-3xl font-semibold tracking-tight outline-none placeholder:text-slate-500"
				/>
			</form>
			{/* div sem conteudo/vazia  apenas para estilo*/}
			<div className="h-px bg-slate-700" />

			<div className="grid grid-cols-3 gap-6 auto-rows-[250px]">
				<NewNoteCard />
				<NoteCard note={note} />
			</div>
		</div>
	);
}
