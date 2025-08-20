import { useEffect, useState } from "react";
import TopBar from "../components/TopBar";
import WaveDivider from "../components/WaveDivider";
import MyCalendar from "../components/MyCalendar";
import { useTranslation } from "react-i18next";
import { useAuth } from "../contexts/UserContext";
import "../i18n";
import "../styles/Schedule.css";

export default function Schedule() {
	const { i18n } = useTranslation();
	const { user, logout } = useAuth();

	// Determine role string
	const role = user ? "admin" : "client"; // if logged in -> admin, else client

	return (
		<>
			<TopBar />
			<div className="schedule-content">
				<MyCalendar key={i18n.language} role={role} />
				<WaveDivider />
			</div>
		</>
	);
}
