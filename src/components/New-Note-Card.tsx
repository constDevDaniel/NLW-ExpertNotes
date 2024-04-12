import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { ChangeEvent, FormEvent, useState } from "react";
import { toast } from "sonner";

interface NewNoteCardProps {
	onNoteCreated: (content: string) => void;
}

let speechRecognition: SpeechRecognition | null;

export function NewNoteCard({ onNoteCreated }: NewNoteCardProps) {
	const [shouldShowOnboarding, setShouldShowOnboarding] = useState(true);
	const [isRecording, setIsRecording] = useState(false);
	const [content, setcontent] = useState("");

	function handleStartEditor() {
		setShouldShowOnboarding(false);
	}

	function handleContentChange(event: ChangeEvent<HTMLTextAreaElement>) {
		setcontent(event.target.value);
		if (event.target.value === "") setShouldShowOnboarding(true);
	}

	function handleSaveNote(event: FormEvent) {
		event.preventDefault();

		if (content === "") {
			toast.error("A nota não pode estar vazia!");
			return;
		}
		onNoteCreated(content);
		setcontent("");
		setShouldShowOnboarding(true);
		toast.success("Nota salva com sucesso!");
	}

	function handleStartRecording(event: FormEvent) {
		// Implementar a lógica de gravação de áudio
		event.preventDefault();

		// Verificar se o navegador suporta a API de reconhecimento de voz
		const isSpeechRecognitionSupported = "SpeechRecognition" in window || "webkitSpeechRecognition" in window;

		if (!isSpeechRecognitionSupported) {
			toast.error("Seu navegador não suporta gravação de áudio!");
			setIsRecording(false);
			return;
		}
		setIsRecording(true);
		setShouldShowOnboarding(false);
		const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;

		speechRecognition = new SpeechRecognitionAPI();
		speechRecognition.lang = "pt-BR";
		speechRecognition.continuous = true;
		speechRecognition.maxAlternatives = 1;
		speechRecognition.interimResults = true;

		speechRecognition.onresult = (event) => {
			const transcription = Array.from(event.results).reduce((text, result) => {
				return text.concat(result[0].transcript);
			}, "");

			setcontent(transcription);
		};

		speechRecognition.start();
	}

	function handleStopRecording() {
		setIsRecording(false);

		if (speechRecognition !== null) {
			speechRecognition.stop();
		}
	}

	return (
		<Dialog.Root>
			<Dialog.Trigger className="rounded-md bg-slate-700 p-5 flex flex-col gap-3 text-left overflow-hidden hover:ring-2 hover:ring-slate-600 outline-none focus-visible:ring-2 focus-visible:ring-lime-200">
				<span className="text-sm font-medium text-slate-200">Adicionar Nota</span>
				<p className="text-sm leading-6 text-slate-400">
					Grave uma nota em áudio que será convertida para texto automaticamente.
				</p>
			</Dialog.Trigger>
			<Dialog.Portal>
				<Dialog.Overlay className="inset-0 fixed bg-black/50" />
				<Dialog.Content className="fixed overflow-hidden inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] w-full md:h-[60vh] bg-slate-700 md:rounded-md flex flex-col outline-none">
					<Dialog.Close className="absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100">
						<X className="size-5" />
					</Dialog.Close>
					<form className="flex-1 flex flex-col">
						<div className="flex flex-1 flex-col gap-3 p-5">
							<span className="text-sm font-medium text-slate-300">Adicionar Nota</span>
							{shouldShowOnboarding ? (
								<p className="text-sm leading-6 text-slate-400 group">
									Comece{" "}
									<button
										onClick={handleStartRecording}
										className="font-medium text-lime-400 hover:underline">
										{" "}
										gravando uma nota
									</button>{" "}
									em áudio ou se preferir{" "}
									<button
										onClick={handleStartEditor}
										className="font-medium text-lime-400 hover:underline">
										utilize apenas texto
									</button>
								</p>
							) : (
								<textarea
									autoFocus
									onChange={handleContentChange}
									value={content}
									className="text-sm leading-6 text-slate-400 bg-transparent resize-none flex-1 outline-none"></textarea>
							)}
						</div>
						{isRecording ? (
							<button
								type="button"
								onClick={handleStopRecording}
								className="w-full flex items-center justify-center gap-2 bg-slate-900 py-4 text-center text-sm text-slate-300 outline-none font-medium hover:text-slate-100">
								<div className="size-3 rounded-full bg-red-500 animate-pulse"></div>
								<span className="text-slate-300 ">Gravando ! (clique p/ interromper)</span>
							</button>
						) : (
							<button
								type="button"
								onClick={handleSaveNote}
								className="w-full bg-lime-400 py-4 text-center text-sm text-slate-300 outline-none font-medium hover:bg-lime-500">
								<span className="text-lime-950 ">Salvar nota</span>
							</button>
						)}
					</form>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
