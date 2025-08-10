import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "./styles/LanguageSelector.css";

export default function LanguageSelector({ currentLang, onChange }) {
	const [open, setOpen] = useState(false);
	const dropdownRef = useRef();
	const { i18n } = useTranslation();

	const languages = (i18n.options.supportedLngs || [])
		.filter((lng) => lng && lng !== "cimode" && lng !== currentLang)
		.map((lng) => ({
			code: lng,
			label: lng.toUpperCase(),
		}));

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
		<div className="language-selector" ref={dropdownRef}>
			<button
				onClick={() => setOpen(!open)}
				className="language-selector-btn"
				aria-haspopup="true"
				aria-expanded={open}
			>
				<span>{currentLang.toUpperCase()}</span>
				<svg
					className={`language-selector-icon ${
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
				<ul className="language-selector-menu" role="menu">
					{languages.length === 0 ? (
						<li
							className="language-selector-item"
							role="menuitem"
							aria-disabled="true"
							style={{ opacity: 0.5, cursor: "default" }}
						>
							Nenhuma outra língua disponível
						</li>
					) : (
						languages.map(({ code, label }) => (
							<li
								key={code}
								onClick={() => handleSelect(code)}
								className="language-selector-item"
								role="menuitem"
							>
								{label}
							</li>
						))
					)}
				</ul>
			)}
		</div>
	);
}
