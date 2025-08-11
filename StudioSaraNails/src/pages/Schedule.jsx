import TopBar from "../components/TopBar";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import "../i18n";
import "../styles/Home.css";
import HomeTitle from "../components/HomeTitle";
import BookNowButton from "../components/BookNowButton";
import WaveDivider from "../components/WaveDivider";
import MyCalendar from "../components/MyCalendar";
import "../styles/Schedule.css";

export default function Schedule() {
	const { i18n } = useTranslation();

	return (
		<>
			<TopBar />
			<div className="schedule-content">
				{/* Key depende del idioma actual */}
				<MyCalendar key={i18n.language} />
			</div>
		</>
	);
}
