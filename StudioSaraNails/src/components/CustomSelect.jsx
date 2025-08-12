import { useState, useEffect, useRef } from "react";


export default function CustomSelect({
	options,
	value,
	onChange,
	placeholder,
}) {
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef(null);

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target)
			) {
				setIsOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () =>
			document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const selectedLabel = options.find((opt) => opt.value === value)?.label;

	return (
		<div className="custom-select" ref={dropdownRef}>
			<button
				type="button"
				onClick={() => setIsOpen((open) => !open)}
				className="custom-select-button"
			>
				{selectedLabel || placeholder}
				<svg
					className={`language-selector-icon ${
						isOpen ? "rotate-180" : "rotate-0"
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

			{isOpen && (
				<ul className="custom-select-list">
					{options.map((opt) => (
						<li
							key={opt.value}
							onClick={() => {
								onChange(opt.value);
								setIsOpen(false);
							}}
							className={`custom-select-item ${
								value === opt.value
									? "custom-select-item-selected"
									: ""
							}`}
						>
							{opt.label}
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
