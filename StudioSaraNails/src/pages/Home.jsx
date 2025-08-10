import TopBar from "../TopBar";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "../i18n";
import "../styles/Home.css";
import Flower from "../assets/flower.png";
import { useNavigate } from "react-router-dom";

export default function Home() {
	const { t, i18n } = useTranslation();
	const title = t("home.title"); // Ejemplo: "Agenda tu cita fácilmente"

	const words = title.split(" ");
	const lastWord = words.pop();
	const rest = words.join(" ");

	const navigate = useNavigate();

	useEffect(() => {
		// Bloquear scroll al montar
		document.body.style.overflow = "hidden";
		document.documentElement.style.overflow = "hidden";

		// Desbloquear scroll al desmontar
		return () => {
			document.body.style.overflow = "";
			document.documentElement.style.overflow = "";
		};
	}, []);

	return (
		<>
			<TopBar></TopBar>
			<div className="home-page">
				<div className="home-title-div">
					<div className="flowers-container">
						<img src={Flower} alt="" />
						<img src={Flower} alt="" />
					</div>
					<h2>
						{rest} <span className="last-word">{lastWord}</span>
					</h2>

					<button class="btn-book-now" type="button" onClick={() => navigate("/schedule")}>
						{t("home.buttonText")}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 16 19"
							class="btn-icon"
						>
							<path d="M7 18C7 18.5523 7.44772 19 8 19C8.55228 19 9 18.5523 9 18H7ZM8.70711 0.292893C8.31658 -0.0976311 7.68342 -0.0976311 7.29289 0.292893L0.928932 6.65685C0.538408 7.04738 0.538408 7.68054 0.928932 8.07107C1.31946 8.46159 1.95262 8.46159 2.34315 8.07107L8 2.41421L13.6569 8.07107C14.0474 8.46159 14.6805 8.46159 15.0711 8.07107C15.4616 7.68054 15.4616 7.04738 15.0711 6.65685L8.70711 0.292893ZM9 18L9 1H7L7 18H9Z"></path>
						</svg>
					</button>

					<div class="custom-shape-divider-bottom-1754796570">
						<svg
							data-name="Layer 1"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 1200 120"
							preserveAspectRatio="none"
						>
							<path
								d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
								opacity=".25"
								class="shape-fill"
							></path>
							<path
								d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
								opacity=".5"
								class="shape-fill"
							></path>
							<path
								d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
								class="shape-fill"
							></path>
						</svg>
					</div>
				</div>
			</div>
		</>
	);
}
