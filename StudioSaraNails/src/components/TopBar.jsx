import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "/logoSaraNails-removebg-preview.png";
import "../i18n";
import LanguageSelector from "./LanguageSelector";
import "../styles/TopBar.css";
import { useAuth } from "../contexts/UserContext";

export default function TopBar() {
	const { t, i18n } = useTranslation();
	const { user, logout } = useAuth();
	const navigate = useNavigate();
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [menuItems, setMenuItems] = useState([]);

	useEffect(() => {
		const translationBundle = i18n.getResource(
			i18n.language,
			"translation"
		);
		const navResources = translationBundle?.nav;

		if (navResources) {
			const keys = Object.keys(navResources);
			setMenuItems(keys);
		} else {
			setMenuItems([]);
		}
	}, [i18n.language]);

	const handleLogoClick = () => {
		if (user) {
			navigate("/admin"); // logged in → admin dashboard
		} else {
			navigate("/"); // not logged in → home
		}
	};

	return (
		<nav className="topbar-nav">
			<div className="container">
				<div className="content">
					{/* Logo */}
					<div
						className="logo-link"
						onClick={handleLogoClick}
						style={{ cursor: "pointer" }}
					>
						<img src={logo} alt="Logo Saranails" />
						<h1 className="hidden">Studio Sara Nails</h1>
					</div>

					{/* Desktop menu */}
					<div className="desktop-menu">
						{menuItems
							.filter((key) => key !== "logout")
							.map((key) => (
								<NavLink
									key={key}
									to={`/${key}`}
									className={({ isActive }) =>
										isActive ? "active-link" : ""
									}
								>
									{t(`nav.${key}`)}
								</NavLink>
							))}

						<LanguageSelector
							currentLang={i18n.language}
							onChange={(lng) => i18n.changeLanguage(lng)}
						/>

						{/* Show Logout if admin is logged in */}
						{user && (
							<button className="logout-button" onClick={logout}>
								{t("nav.logout")}
							</button>
						)}
					</div>

					{/* Mobile menu button */}
					<div className="mobile-menu-button">
						<button
							onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
							type="button"
							aria-controls="mobile-menu"
							aria-expanded={mobileMenuOpen}
						>
							<span className="sr-only">{t("nav.language")}</span>
							<svg
								className={
									mobileMenuOpen
										? "rotate-90 scale-110"
										: "rotate-0 scale-100"
								}
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

			{/* Mobile menu */}
			<div
				id="mobile-menu"
				className={`mobile-menu ${mobileMenuOpen ? "open" : "closed"}`}
			>
				<div className="menu-links">
					{menuItems
						.filter((key) => key !== "logout")
						.map((key) => (
							<NavLink
								key={key}
								to={`/${key}`}
								className={({ isActive }) =>
									isActive ? "active-link" : ""
								}
							>
								{t(`nav.${key}`)}
							</NavLink>
						))}

					<LanguageSelector
						currentLang={i18n.language}
						onChange={(lng) => i18n.changeLanguage(lng)}
					/>

					{user && (
						<div className="mobile-logout-container">
							<button className="logout-button" onClick={logout}>
								{t("nav.logout")}
							</button>
						</div>
					)}
				</div>
			</div>
		</nav>
	);
}
