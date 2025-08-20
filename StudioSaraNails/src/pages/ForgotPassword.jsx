import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import  supabase  from "../supabaseClient";
import { useTranslation } from "react-i18next";
import "../styles/LoginForm.css";
import "../styles/Login.css";
import WaveDivider from "../components/WaveDivider";
import "../styles/WaveDivider.css";
import { useEffect } from "react";


export default function ForgotPassword() {
	const { t } = useTranslation();

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

	// Schema de validación
	const schema = yup.object({
		email: yup
			.string()
			.required(t("forgotPassword.emailRequired"))
			.email(t("forgotPassword.emailInvalid")),
	});

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(schema),
		defaultValues: { email: "" },
	});

	const handleForgotPassword = async ({ email }) => {
		const { error } = await supabase.auth.resetPasswordForEmail(email, {
			redirectTo: `${window.location.origin}/reset-password`, // la ruta donde el user actualizará la contraseña
		});

		if (error) {
			toast.error(error.message || t("forgotPassword.error"));
		} else {
			toast.success(t("forgotPassword.success"));
		}
	};

	return (
        <>
		<div className="login-page">
            <div className="login-form-div">
			<form onSubmit={handleSubmit(handleForgotPassword)} className="login-form">
				<h2 className="login-title">{t("forgotPassword.title")}</h2>
				<p className="text-center text-sm text-gray-600 mb-4">
					{t("forgotPassword.description")}
				</p>

				<div className="form-group">
					<label className="label">{t("forgotPassword.emailLabel")}</label>
					<input
						{...register("email")}
						className="input"
						placeholder={t("forgotPassword.emailPlaceholder")}
					/>
					{errors.email && (
						<p className="error-message">{errors.email.message}</p>
					)}
				</div>

				<div className="button-container">
					<button type="submit" className="button-submit">
						{t("forgotPassword.submit")}
					</button>
				</div>
			</form>
            </div>
		</div>
        <WaveDivider />
        </>
	);
}
