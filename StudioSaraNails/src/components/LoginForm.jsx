import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import supabase from "../supabaseClient";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../styles/LoginForm.css";
import { useEffect } from "react";

export default function LoginForm() {
	const navigate = useNavigate();
	const { t } = useTranslation();

	// Schema con traducciones dinámicas
	const schema = yup.object({
		email: yup
			.string()
			.required(t("login.emailRequired"))
			.email(t("login.emailInvalid")),
		password: yup.string().required(t("login.passwordRequired")),
	});

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(schema),
		defaultValues: { email: "", password: "" },
	});

	const handleLogin = async (data) => {
		const { email, password } = data;

		const { error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		if (error) {
			toast.error(error.message || t("login.error"));
		} else {
			toast.success(t("login.success"));
			navigate("/admin");
		}
	};
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
		<form onSubmit={handleSubmit(handleLogin)} className="login-form">
			<div className="form-group">
				<label className="label">{t("login.emailLabel")}</label>
				<input
					{...register("email")}
					className="input"
					placeholder={t("login.emailPlaceholder")}
				/>
				{errors.email && (
					<p className="error-message">{errors.email.message}</p>
				)}
			</div>

			<div className="form-group">
				<label className="label">{t("login.passwordLabel")}</label>
				<input
					type="password"
					{...register("password")}
					className="input"
					placeholder={t("login.passwordPlaceholder")}
				/>
				{errors.password && (
					<p className="error-message">{errors.password.message}</p>
				)}
			</div>
			<div className="forgot-password-div">
				<Link to="/forgot-password">{t("login.forgotPassword")}</Link>
			</div>

			<div className="button-container">
				<button type="submit" className="button-submit">
					{t("login.submit")}
				</button>
			</div>
		</form>
	);
}
