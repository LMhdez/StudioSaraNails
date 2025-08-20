import { useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import { useForm, useController } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import "../styles/AppointmentForm.css";
import { useTranslation } from "react-i18next";
import "../i18n";
import CustomSelect from "./CustomSelect.jsx";
import supabase from "../supabaseClient";
import { Link } from "react-router-dom";
import TrashIcon from "../assets/TrashIcon.jsx";

const venezuelaPhoneRegex = /^(0(2[0-9]{2}|4[0-9]{2}))[0-9]{7}$/;

export default function AppointmentForm({
	dateTime,
	onSubmit,
	onClose,
	isEditMode = false,
	eventId,
	handleDelete
}) {
	const { t, i18n } = useTranslation();
	const modalRef = useRef(null);
	const [serviceOptions, setServiceOptions] = useState([]);
	const [loading, setLoading] = useState(false);
	const [appointmentDate, setAppointmentDate] = useState(null);

	// Yup schema (only used in create mode)
	const schema = yup.object({
		name: yup
			.string()
			.required(t("form.nameRequired"))
			.min(3, t("form.nameMin")),
		phone: yup
			.string()
			.required(t("form.phoneRequired"))
			.matches(venezuelaPhoneRegex, t("form.phoneInvalid")),
		email: yup
			.string()
			.required(t("form.emailRequired"))
			.email(t("form.emailInvalid")),
		service: yup.string().required(t("form.serviceRequired")),
	});

	// Detect click outside to close modal
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (modalRef.current && !modalRef.current.contains(event.target)) {
				onClose();
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () =>
			document.removeEventListener("mousedown", handleClickOutside);
	}, [onClose]);

	// React Hook Form
	const {
		control,
		register,
		handleSubmit,
		formState: { errors },
		reset,
		setValue,
	} = useForm({
		resolver: !isEditMode ? yupResolver(schema) : undefined,
		defaultValues: {
			name: "",
			phone: "",
			email: "",
			service: "",
			duration_hours: 1,
		},
	});

	const {
		field: { value: serviceValue, onChange: onServiceChange },
	} = useController({
		name: "service",
		control,
	});

	// Fetch categories for create mode
	useEffect(() => {
		const fetchServices = async () => {
			const { data, error } = await supabase.from("service_categories")
				.select(`
          id,
          name_es,
          name_en,
          services(price)
        `);

			if (error) {
				console.error("Error fetching services:", error);
				return;
			}

			const options = data.map((cat) => ({
				value: cat.id,
				label: `${
					i18n.language === "es" ? cat.name_es : cat.name_en
				} - ${cat.services
					.map((s) => `$${s.price.toFixed(2)}`)
					.join(", ")}`,
			}));

			setServiceOptions(options);
		};

		fetchServices();
	}, [i18n.language]);

	// Fetch event if edit mode
	useEffect(() => {
		if (!isEditMode || !eventId) return;

		const fetchEvent = async () => {
			setLoading(true);
			const { data, error } = await supabase
				.from("appointments")
				.select("*")
				.eq("id", eventId)
				.single();

			if (error) {
				console.error("Error fetching event:", error);
				setLoading(false);
				return;
			}

			setValue("name", data.customer_name);
			setValue("phone", data.customer_phone);
			setValue("email", data.customer_email);
			setValue("service", data.service_type);
			setValue("duration_hours", data.duration_hours);
			setValue("status", data.status);

			// Save full datetime for header
			const fullDate = new Date(`${data.date}T${data.start_time}`);
			setAppointmentDate(fullDate);

			setLoading(false);
		};

		fetchEvent();
	}, [isEditMode, eventId, setValue]);

	const handleFormSubmit = async (formData) => {
		if (isEditMode) {
			// 1. Actualizamos en Supabase
			const { data, error } = await supabase
				.from("appointments")
				.update({
					duration_hours: formData.duration_hours,
					status: "confirmed",
				})
				.eq("id", eventId)
				.select("*")
				.single();

			if (error) {
				toast.error("Error updating appointment");
				return;
			}

			// 2. Calcular nuevo end basado en duration_hours
			const start = new Date(`${data.date}T${data.start_time}`);
			const end = new Date(start);
			end.setHours(start.getHours() + Number(formData.duration_hours));

			// 3. Construir objeto evento completo para Schedule-X
			const updatedEvent = {
				id: data.id,
				title: `${data.customer_name} - ${data.service_type}`,
				start: start.toISOString().slice(0, 16).replace("T", " "), // formato "YYYY-MM-DD HH:mm"
				end: end.toISOString().slice(0, 16).replace("T", " "),
				calendarId: "admin",
			};

			// 4. Pasar el evento a tu calendario
			if (onSubmit({ ...updatedEvent })) {
				toast.success(t("calendar.appointment_updated"));
			}
			onClose();
			return;
		}

		if (onSubmit({ ...formData, dateTime })) {
			toast.success(
				<div className="mx-4">
					<p className="font-semibold">{t("form.toast.title")}</p>
					<p>{t("form.toast.message1")}</p>
					<p className="mt-1">{t("form.toast.message2")}</p>
				</div>,
				{ duration: 10000 }
			);
		}

		reset();
		onClose();
	};

	if (loading) return <p>Loading...</p>;

	return (
		<div className="modal-overlay">
			<div ref={modalRef} className="modal-container">
				<div className="modal-header">
					<button onClick={onClose} className="modal-close-button">
						x
					</button>
					{isEditMode && (
						<button
							onClick={handleDelete}
							className="modal-delete-button"
							title={t("form.buttons.delete")}
						>
							<TrashIcon/>
							{t("form.buttons.delete")}
						</button>
					)}
				</div>

				<form
					onSubmit={handleSubmit(handleFormSubmit)}
					className="form-container"
				>
					<div className="dateLine">
						{t("form.bookingFor")}{" "}
						<strong>
							{isEditMode && appointmentDate
								? format(appointmentDate, "yyyy-MM-dd HH:mm")
								: !isEditMode && dateTime
								? format(new Date(dateTime), "yyyy-MM-dd HH:mm")
								: ""}
						</strong>
					</div>

					{isEditMode && (
						<div>
							<label className="label">
								{t("form.status_label")}
							</label>
							<input
								{...register("status")}
								className={`input ${
									control._formValues.status === "confirmed"
										? "input-confirmed"
										: control._formValues.status ===
										  "pending"
										? "input-pending"
										: ""
								}`}
								disabled
							/>
						</div>
					)}

					<div>
						<label className="label">{t("form.nameLabel")}</label>
						<input
							{...register("name")}
							className="input"
							placeholder={t("form.namePlaceholder")}
							disabled={isEditMode}
						/>
						{errors.name && (
							<p className="error-message">
								{errors.name.message}
							</p>
						)}
					</div>

					<div>
						<label className="label">{t("form.phoneLabel")}</label>
						{isEditMode ? (
							<Link
								className="input wa-link"
								href={`https://wa.me/${control._formValues.phone}`}
								target="_blank"
								rel="noreferrer"
							>
								{control._formValues.phone}
							</Link>
						) : (
							<input
								{...register("phone")}
								className="input"
								placeholder={t("form.phonePlaceholder")}
							/>
						)}
						{errors.phone && (
							<p className="error-message">
								{errors.phone.message}
							</p>
						)}
					</div>

					<div>
						<label className="label">{t("form.emailLabel")}</label>
						<input
							{...register("email")}
							className="input"
							placeholder={t("form.emailPlaceholder")}
							disabled={isEditMode}
						/>
						{errors.email && (
							<p className="error-message">
								{errors.email.message}
							</p>
						)}
					</div>

					<div>
						<Link className="link" to="/services">
							{t("form.viewCatalog")}
						</Link>

						<label className="label">
							{t("form.serviceLabel")}
						</label>

						{isEditMode ? (
							<input
								type="text"
								{...register("service")}
								className="input"
								disabled
							/>
						) : (
							<CustomSelect
								options={serviceOptions}
								value={serviceValue}
								onChange={onServiceChange}
								placeholder={t("form.servicePlaceholder")}
							/>
						)}

						{errors.service && (
							<p className="error-message">
								{errors.service.message}
							</p>
						)}
					</div>

					{isEditMode && (
						<div>
							<label className="label">
								{t("form.duration_label")}
							</label>
							<input
								type="number"
								{...register("duration_hours", { min: 1 })}
								className="input"
								placeholder="Duration in hours"
							/>
						</div>
					)}

					<div className="button-group">
						<button
							type="button"
							onClick={onClose}
							className="button-cancel"
						>
							{t("form.buttons.cancel")}
						</button>
						<button type="submit" className="button-submit">
							{isEditMode
								? t("form.buttons.confirm")
								: t("form.buttons.create")}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
