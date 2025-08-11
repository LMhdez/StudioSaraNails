import { useState, useEffect, useRef } from "react";
import { calendars } from "../calendarConfig";
import {
	format,
	startOfMonth,
	endOfMonth,
	addHours,
	parseISO,
	addDays,
	startOfYear,
} from "date-fns";
import supabase from "../supabaseClient";
import { useTranslation } from "react-i18next";
import { useCalendarApp, ScheduleXCalendar } from "@schedule-x/react";
import {
	createViewDay,
	createViewMonthAgenda,
	createViewMonthGrid,
	createViewWeek,
} from "@schedule-x/calendar";
import {
	createEventRecurrencePlugin,
	createEventsServicePlugin,
} from "@schedule-x/event-recurrence";
import { createCurrentTimePlugin } from "@schedule-x/current-time";
import "@schedule-x/theme-default/dist/index.css";
import "../styles/MyCalendar.css";
import { createCalendarControlsPlugin } from "@schedule-x/calendar-controls";
import { createScrollControllerPlugin } from "@schedule-x/scroll-controller";

export default function MyCalendar({ role = "client" }) {
	const { t, i18n } = useTranslation();
	const [events, setEvents] = useState([]);

	const today = new Date();
	today.setHours(0, 0, 0, 0);
	const todayStr = format(today, "yyyy-MM-dd");

	const calendarControlsRef = useRef(null);
	if (!calendarControlsRef.current) {
		calendarControlsRef.current = createCalendarControlsPlugin();
	}
	const calendarControls = calendarControlsRef.current;

	// Mantener la instancia del plugin con useRef para que persista
	const eventsServiceRef = useRef(null);
	if (!eventsServiceRef.current) {
		eventsServiceRef.current = createEventsServicePlugin();
	}
	const eventsService = eventsServiceRef.current;

	async function fetchEvents(currentDate, role) {
		const startMonth = startOfMonth(currentDate);
		const endMonth = endOfMonth(currentDate);

		const startOfMonthStr = format(startMonth, "yyyy-MM-dd");
		const endOfMonthStr = format(endMonth, "yyyy-MM-dd");

		let query = supabase.from("appointments");

		if (role === "admin") {
			query = query
				.select("*")
				.gte("date", startOfMonthStr)
				.lte("date", endOfMonthStr);
		} else {
			query = query
				.select("id, date, start_time, duration_hours, status")
				.gte("date", startOfMonthStr)
				.lte("date", endOfMonthStr)
				.in("status", ["pending", "confirmed"]);
		}

		const { data, error } = await query;

		if (error) {
			console.error("Error fetching appointments:", error);
			return;
		}

		const mappedEvents = data.map((appointment) => {
			const startDate = parseISO(
				`${appointment.date}T${appointment.start_time}`
			);
			const endDate = addHours(startDate, appointment.duration_hours);

			return {
				id: appointment.id,
				title: t("calendar.busy") || "Ocupado",
				start: format(startDate, "yyyy-MM-dd HH:mm"),
				end: format(endDate, "yyyy-MM-dd HH:mm"),
				calendarId: role,
			};
		});

		setEvents(mappedEvents);

		// Actualizar eventos en el plugin para refrescar calendario
		eventsService.set(mappedEvents);
	}
	const localesMap = {
		es: "es-ES",
		en: "en-US",
	};
	const backgroundEvents = [
		{
			title: "Fuera de horario laboral",
			start: "2024-01-01 23:00",
			end: "2024-01-02 08:00",
			rrule: "FREQ=DAILY;BYDAY=MO,TU,WE,TH,FR,SA",
			style: {
				backgroundImage:
					"repeating-linear-gradient(45deg, #ccc, #ccc 5px, transparent 5px, transparent 10px)",
				opacity: 0.3,
			},
		},
		{
			title: "Domingo no laborable",
			start: format(startOfYear(today), "yyyy-MM-dd HH:mm"),
			end: format(addHours(startOfYear(today), 24), "yyyy-MM-dd HH:mm"),
			rrule: "FREQ=WEEKLY;BYDAY=SU",
			style: {
				backgroundImage:
					"repeating-linear-gradient(45deg, #ccc, #ccc 5px, transparent 5px, transparent 10px)",
				opacity: 0.3,
			},
		},
		{
			start: format(startOfYear(today), "yyyy-MM-dd"),
			end: format(addDays(today, 2), "yyyy-MM-dd"),
			title: "Evento fondo próximos 2 días",
			style: {
				backgroundImage:
					"repeating-linear-gradient(45deg, #ccc, #ccc 5px, transparent 5px, transparent 10px)",
				opacity: 0.3,
			},
		},
	];

	const monthGridView = createViewMonthGrid();
	const recurrencePlugin = createEventRecurrencePlugin();
	const scrollController = createScrollControllerPlugin({
		initialScroll: "08:00",
	});
	// Inicializar el calendario con hook directamente en el componente (no en useMemo)
	const calendarApp = useCalendarApp({
		calendars,
		views: [monthGridView, createViewMonthAgenda(), createViewDay()],
		defaultView: monthGridView.name,
		events: [],
		backgroundEvents: backgroundEvents,
		minDate: todayStr,
		plugins: [
			eventsService,
			createCurrentTimePlugin(),
			calendarControls,
			recurrencePlugin,
			scrollController,
		],
		selectedDate: todayStr,
		onRangeUpdate: (range) => {
			fetchEvents(new Date(range.start), role);
		},
		locale: localesMap[i18n.language],
		callbacks: {
			onDoubleClickAgendaDate(date) {
				calendarControls.setView("day");
				calendarControls.setDate(date);
				console.log("Doble clic en la fecha:", date);
			},
			onClickDate(date) {
				calendarControls.setView("day");
				calendarControls.setDate(date);
				console.log("Clic en la fecha:", date);
			},
			onEventClick(event) {
				// Cambiar a vista día
				calendarControls.setView("day");
				// Setear la fecha al día del evento
				calendarControls.setDate(event.start.slice(0, 10)); // 'yyyy-MM-dd'
				console.log("Clic en el evento:", event);
			},
		},
	});

	useEffect(() => {
		fetchEvents(today, role);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [role]);

	return (
		<div className="calendar-container">
			<ScheduleXCalendar calendarApp={calendarApp} />
		</div>
	);
}
