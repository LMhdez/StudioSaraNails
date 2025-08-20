import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "../i18n";
import "../styles/Home.css";
import "../styles/AdminHome.css";

import WaveDivider from "../components/WaveDivider";
import StatCard from "../components/StatCard";
import TopBar from "../components/TopBar";
import supabase from "../supabaseClient";

import {
	format,
	isToday,
	isTomorrow,
	isThisWeek,
	isThisMonth,
	parseISO,
	isYesterday,
	subWeeks,
	subMonths,
	isWithinInterval,
} from "date-fns";

export default function AdminHome() {
	const { t } = useTranslation();
	const [appointments, setAppointments] = useState([]);
	const [futureStats, setFutureStats] = useState({
		pending: 0,
		confirmed: 0,
		today: 0,
		tomorrow: 0,
		thisWeek: 0,
		thisMonth: 0,
	});
	const [pastStats, setPastStats] = useState({
		yesterday: 0,
		lastWeek: 0,
		lastMonth: 0,
		allPast: 0,
	});

	useEffect(() => {
		const fetchAppointments = async () => {
			const { data, error } = await supabase
				.from("appointments")
				.select("*")
				.order("date", { ascending: true });

			if (!error) setAppointments(data || []);
		};
		fetchAppointments();
	}, []);

	useEffect(() => {
		const now = new Date();

		const future = {
			pending: 0,
			confirmed: 0,
			today: 0,
			tomorrow: 0,
			thisWeek: 0,
			thisMonth: 0,
		};

		const past = {
			yesterday: 0,
			lastWeek: 0,
			lastMonth: 0,
			allPast: 0,
		};

		appointments.forEach((a) => {
			const date = parseISO(a.date);

			// FUTURE
			if (a.status === "pending") {
				future.pending++;
			} else if (a.status === "confirmed") {
				if (date >= now) {
					future.confirmed++;
					if (isToday(date)) future.today++;
					if (isTomorrow(date)) future.tomorrow++;
					if (isThisWeek(date)) future.thisWeek++;
					if (isThisMonth(date)) future.thisMonth++;
				} else {
					// PAST
					past.allPast++;
					if (isYesterday(date)) past.yesterday++;
					if (
						isWithinInterval(date, {
							start: subWeeks(now, 1),
							end: now,
						})
					)
						past.lastWeek++;
					if (
						isWithinInterval(date, {
							start: subMonths(now, 1),
							end: now,
						})
					)
						past.lastMonth++;
				}
			}
		});

		setFutureStats(future);
		setPastStats(past);
	}, [appointments]);

	return (
		<>
			<TopBar />
			<div className="admin-home">
				<div className="dashboard-container">
					<h2 className="dashboard-title">{t("admin.dashboard")}</h2>

					<h3 className="section-title">{t("admin.future")}</h3>
					<div className="stats-grid">
						<StatCard
							title={t("admin.stats.pending")}
							value={futureStats.pending}
							variant="stat-pending"
						/>
						<StatCard
							title={t("admin.stats.confirmed")}
							value={futureStats.confirmed}
							variant="stat-confirmed"
						/>
						<StatCard
							title={t("admin.stats.today")}
							value={futureStats.today}
							variant="stat-today"
						/>
						<StatCard
							title={t("admin.stats.tomorrow")}
							value={futureStats.tomorrow}
							variant="stat-tomorrow"
						/>
						<StatCard
							title={t("admin.stats.thisWeek")}
							value={futureStats.thisWeek}
							variant="stat-week"
						/>
						<StatCard
							title={t("admin.stats.thisMonth")}
							value={futureStats.thisMonth}
							variant="stat-month"
						/>
					</div>

					<h3 className="section-title">{t("admin.past")}</h3>
					<div className="stats-grid">
						<StatCard
							title={t("admin.stats.yesterday")}
							value={pastStats.yesterday}
							variant="stat-yesterday"
						/>
						<StatCard
							title={t("admin.stats.lastWeek")}
							value={pastStats.lastWeek}
							variant="stat-lastWeek"
						/>
						<StatCard
							title={t("admin.stats.lastMonth")}
							value={pastStats.lastMonth}
							variant="stat-lastMonth"
						/>
						<StatCard
							title={t("admin.stats.allPast")}
							value={pastStats.allPast}
							variant="stat-allPast"
						/>
					</div>
				</div>
				<WaveDivider />
			</div>
		</>
	);
}
