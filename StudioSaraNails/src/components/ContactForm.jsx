import { useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import { useForm, useController } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import "../styles/ContactForm.css";
import { useTranslation } from "react-i18next";
import "../i18n";


export default function ContactForm({ onSubmit }) {
	const { t, i18n } = useTranslation();

	// Esquema yup con traducción dinámica
	const schema = yup.object({
		name: yup
			.string()
			.required(t("form.nameRequired"))
			.min(3, t("form.nameMin")),
		email: yup
			.string()
			.required(t("form.emailRequired"))
			.email(t("form.emailInvalid")),
		message: yup.string().required(t("form.messageRequired")),
	});

	// React Hook Form
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm({
		resolver: yupResolver(schema),
		defaultValues: { name: "", email: "", service: "" },
	});

	const handleFormSubmit = (data) => {
		if (onSubmit({ ...data})) {
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
	};

	return (
		<form
			onSubmit={handleSubmit(handleFormSubmit)}
			className="form-container"
		>
			<div>
				<label className="label">{t("form.nameLabel")}</label>
				<input
					{...register("name")}
					className="input"
					placeholder={t("form.namePlaceholder")}
				/>
				{errors.name && (
					<p className="error-message">{errors.name.message}</p>
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
					<p className="error-message">{errors.email.message}</p>
				)}
			</div>
			<div>
				<label className="label">{t("contact.message")}</label>
				<textarea
					{...register("message")}
					className="textarea"
					placeholder={t("contact.messagePlaceholder")}
				></textarea>
				{errors.message && (
					<p className="error-message">{errors.message.message}</p>
				)}
			</div>

			<div className="button-container">
				<button type="submit" className="button-submit">
					{t("contact.submit")}
				</button>
			</div>
		</form>
	);
}
