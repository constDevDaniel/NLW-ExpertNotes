import { ChangeEvent, useState } from "react";
import logoNlwExpert from "./assets/logo-nlw-expert.svg";
import { NewNoteCard } from "./components/New-Note-Card";
import { NoteCard } from "./components/Note-Card";
import { toast } from "sonner";


interface Note {
	id: string;
	date: Date;
	content: string;
}

export function App() {
	const [search, setSearch] = useState("");
	const [notes, setNotes] = useState<Note[]>(() => {
		const notesOnLocalStorage = localStorage.getItem("notes");

		if (notesOnLocalStorage) {
			return JSON.parse(notesOnLocalStorage);
		}
		return [];
	});

	function onNoteCreated(content: string) {
		const newNote = {
			id: crypto.randomUUID(),
			date: new Date(),
			content,
		};

		const notesArray = [newNote, ...notes];
		setNotes(notesArray);

		localStorage.setItem("notes", JSON.stringify(notesArray));
	}

	function onNoteDeleted(id: string) {
		const notesArray = notes.filter((note) => note.id !== id);
		toast.success("Nota apagada com sucesso!")
		setNotes(notesArray);
		localStorage.setItem("notes", JSON.stringify(notesArray));
	}

	function handleSearch(event: ChangeEvent<HTMLInputElement>) {
		setSearch(event.target.value);
	}

	const filteredNotes =
		search !== ""
			? notes.filter((note) => note.content.toLocaleLowerCase().includes(search.toLocaleLowerCase()))
			: notes;

	return (
		<div className="mx-auto max-w-6xl my-12 space-y-6 px-5">
			<img src={logoNlwExpert} alt="NLW Expert" className="max-h-[5vh]" />
			<form className="w-full my-6">
				<input
					type="text"
					onChange={handleSearch}
					placeholder="Busque em suas notas..."
					className="w-full bg-transparent text-3xl font-semibold tracking-tight outline-none placeholder:text-slate-500"
				/>
			</form>
			{/* div sem conteudo/vazia  apenas para estilo*/}
			<div className="h-px bg-slate-700" />

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[250px]">
				<NewNoteCard onNoteCreated={onNoteCreated} />
				{filteredNotes.map((note) => {
					return <NoteCard key={note.id} note={note} onNoteDeleted={onNoteDeleted} />;
				})}
			</div>
		</div>
	);
}
