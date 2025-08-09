import { useState, useRef, useEffect } from "react";

export default function LanguageSelector({ currentLang, onChange }) {
	const [open, setOpen] = useState(false);
	const dropdownRef = useRef();

	const languages = [
		{ code: "es", label: "ES" },
		{ code: "en", label: "EN" },
	];

	useEffect(() => {
		function handleClickOutside(event) {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target)
			) {
				setOpen(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () =>
			document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const handleSelect = (code) => {
		onChange(code);
		setOpen(false);
	};

	return (
		<div
			className="relative inline-block text-left w-24 sm:w-auto"
			ref={dropdownRef}
		>
			<button
				onClick={() => setOpen(!open)}
				className="w-full sm:w-auto bg-[#4c114b] text-white rounded px-3 py-2 text-sm flex items-center justify-between space-x-2 focus:outline-none focus:ring-2 focus:ring-[#a688a5] focus:ring-offset-1 transition"
				aria-haspopup="true"
				aria-expanded={open}
			>
				<span>{currentLang.toUpperCase()}</span>
				<svg
					className={`w-4 h-4 transform transition-transform duration-300 ${
						open ? "rotate-180" : "rotate-0"
					}`}
					fill="none"
					stroke="currentColor"
					strokeWidth={2}
					viewBox="0 0 24 24"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M19 9l-7 7-7-7"
					/>
				</svg>
			</button>

			{open && (
				<ul
					className="absolute right-0 mt-2 w-full sm:w-24 bg-[#4c114b] rounded shadow-lg ring-1 ring-black ring-opacity-30 focus:outline-none z-20"
					role="menu"
				>
					{languages.map(({ code, label }) => (
						<li
							key={code}
							onClick={() => handleSelect(code)}
							className="block px-4 py-3 text-white text-base sm:text-sm hover:bg-[#a688a5] cursor-pointer transition-colors"
							role="menuitem"
						>
							{label}
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
