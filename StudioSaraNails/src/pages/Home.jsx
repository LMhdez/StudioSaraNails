import TopBar from "../components/TopBar";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import "../i18n";
import "../styles/Home.css";
import HomeTitle from "../components/HomeTitle";
import BookNowButton from "../components/BookNowButton";
import WaveDivider from "../components/WaveDivider";
import "../styles/FlowerContainer.css";
import "../styles/WaveDivider.css";
import "../styles/BookNowButton.css";


export default function Home() {
	const { t } = useTranslation();
	const title = t("home.title");

	const words = title.split(" ");
	const lastWord = words.pop();
	const rest = words.join(" ");

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
			<TopBar />
			<div className="home-page">
                <div className="home-title-div">
				<HomeTitle title={rest} lastWord={lastWord} />
				<BookNowButton label={t("home.buttonText")} />
                </div>
				<WaveDivider />
			</div>
		</>
	);
}
