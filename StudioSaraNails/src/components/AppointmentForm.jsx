import { useEffect, useRef } from "react";
import { format } from "date-fns";
import { useForm, useController } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import "../styles/AppointmentForm.css";
import { useTranslation } from "react-i18next";
import "../i18n";
import CustomSelect from "./CustomSelect.jsx";

const venezuelaPhoneRegex = /^(0(2[0-9]{2}|4[0-9]{2}))[0-9]{7}$/;

export default function AppointmentForm({ dateTime, onSubmit, onClose }) {
	const { t } = useTranslation();
	const modalRef = useRef(null);

	// Esquema yup con traducción dinámica
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

	// Detectar click fuera para cerrar modal
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

	const {
		control,
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm({
		resolver: yupResolver(schema),
		defaultValues: { name: "", phone: "", email: "", service: "" },
	});

	const services = [
		{ value: "soft-gel", label: t("services.soft-gel") },
		{ value: "acrylic-system", label: t("services.acrylic-system") },
		{
			value: "rubber-base-leveling",
			label: t("services.rubber-base-leveling"),
		},
		{ value: "kapping", label: t("services.kapping") },
	];
	const {
		field: { value: serviceValue, onChange: onServiceChange },
	} = useController({
		name: "service",
		control,
	});

	const handleFormSubmit = (data) => {
		{
			if (onSubmit({ ...data, dateTime })) {
				toast.success(
					<div className="mx-4">
						<p className="font-semibold">{t("form.toast.title")}</p>
						<p>{t("form.toast.message1")}</p>
						<p className="mt-1">{t("form.toast.message2")}</p>
					</div>,
					{ duration: 10000 }
				);
			}
		}

		reset();
		onClose();
	};

	return (
		<div className="modal-overlay">
			<div ref={modalRef} className="modal-container">
				<button onClick={onClose} className="modal-close-button">
					x
				</button>

				<form
					onSubmit={handleSubmit(handleFormSubmit)}
					className="form-container"
				>
					<div className="dateLine">
						{t("form.bookingFor")}{" "}
						<strong>{format(dateTime, "yyyy-MM-dd HH:mm")}</strong>
					</div>

					<div>
						<label className="label">{t("form.nameLabel")}</label>
						<input
							{...register("name")}
							className="input"
							placeholder={t("form.namePlaceholder")}
						/>
						{errors.name && (
							<p className="error-message">
								{errors.name.message}
							</p>
						)}
					</div>

					<div>
						<label className="label">{t("form.phoneLabel")}</label>
						<input
							{...register("phone")}
							className="input"
							placeholder={t("form.phonePlaceholder")}
						/>
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
						/>
						{errors.email && (
							<p className="error-message">
								{errors.email.message}
							</p>
						)}
					</div>

					<div>
						<label className="label">
							{t("form.serviceLabel")}
						</label>

						<CustomSelect
							options={services}
							value={serviceValue}
							onChange={onServiceChange}
							placeholder={t("form.servicePlaceholder")}
						/>
						{errors.service && (
							<p className="error-message">
								{errors.service.message}
							</p>
						)}
					</div>

					<div className="button-group">
						<button
							type="button"
							onClick={onClose}
							className="button-cancel"
						>
							{t("form.buttons.cancel")}
						</button>
						<button type="submit" className="button-submit">
							{t("form.buttons.submit")}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
