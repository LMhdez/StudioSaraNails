import { useState } from "react";
import { useTranslation } from "react-i18next";
import logo from "/logoSaraNails-removebg-preview.png";
import "./i18n";
import "./styles/TopBar.scss";
import LanguageSelector from "./LanguageSelector";

export default function TopBar() {
	const { t, i18n } = useTranslation();
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	const changeLanguage = (lng) => {
		i18n.changeLanguage(lng);
	};

	return (
		<nav className="bg-[#260926] text-white shadow-md">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between h-16 items-center">
					{/* Logo */}
					<div className="flex-shrink-0">
						<a
							href="/"
							className="text-2xl font-bold text-[#a688a5]"
						>
							<img
								src={logo}
								className="h-12 w-auto"
								alt="Logo Saranails"
							/>
						</a>
					</div>

					{/* Desktop menu */}
					<div className="hidden md:flex items-center space-x-8">
						{["home", "services", "schedule", "contact"].map(
							(key) => (
								<a
									key={key}
									href="#"
									className="text-white hover:text-[#a688a5] px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ease-in-out"
								>
									{t(`nav.${key}`)}
								</a>
							)
						)}

						{/* Selector de idioma */}

						<LanguageSelector
							currentLang={i18n.language}
							onChange={(lng) => i18n.changeLanguage(lng)}
						/>
					</div>

					{/* Mobile menu button */}
					<div className="md:hidden ">
						<button
							onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
							type="button"
							className="inline-flex items-center justify-center p-2 rounded-md text-[#a688a5] hover:text-white hover:bg-[#4c114b] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#a688a5] transition-colors duration-300 ease-in-out"
							aria-controls="mobile-menu"
							aria-expanded={mobileMenuOpen}
						>
							<span className="sr-only">{t("nav.language")}</span>
							<svg
								className={`block h-6 w-6 transform transition-transform duration-300 ease-in-out ${
									mobileMenuOpen
										? "rotate-90 scale-110"
										: "rotate-0 scale-100"
								}`}
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								aria-hidden="true"
							>
								{mobileMenuOpen ? (
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M6 18L18 6M6 6l12 12"
									/>
								) : (
									<>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M4 8h16"
										/>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M4 16h16"
										/>
									</>
								)}
							</svg>
						</button>
					</div>
				</div>
			</div>

			{/* Mobile menu with smooth fade+slide */}
			<div
				id="mobile-menu"
				className={`md:hidden bg-[#260926] overflow-visible transform transition-all duration-300 ease-in-out ${
					mobileMenuOpen
						? "max-h-96 opacity-100 translate-y-3"
						: "max-h-0 opacity-0 -translate-y-2 pointer-events-none"
				}`}
			>
				<div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
					{["home", "services", "schedule", "contact"].map((key) => (
						<a
							key={key}
							href="#"
							className="block text-white hover:text-[#a688a5] px-3 py-2 rounded-md text-base font-medium transition-colors duration-300 ease-in-out"
						>
							{t(`nav.${key}`)}
						</a>
					))}

					{/* Selector idioma móvil */}
					<LanguageSelector
						currentLang={i18n.language}
						onChange={(lng) => i18n.changeLanguage(lng)}
					/>
				</div>
			</div>
		</nav>
	);
}
