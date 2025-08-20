import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import supabase from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../styles/LoginForm.css";
import WaveDivider from "../components/WaveDivider";
import "../styles/WaveDivider.css";
import { useEffect } from "react";


export default function ResetPassword() {
	const navigate = useNavigate();
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
		password: yup
			.string()
			.required(t("resetPassword.passwordRequired"))
			.min(6, t("resetPassword.passwordMin")),
		confirmPassword: yup
			.string()
			.required(t("resetPassword.confirmRequired"))
			.oneOf([yup.ref("password")], t("resetPassword.confirmMatch")),
	});

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(schema),
		defaultValues: { password: "", confirmPassword: "" },
	});

	const handleResetPassword = async ({ password }) => {
		const { error } = await supabase.auth.updateUser({ password });

		if (error) {
			toast.error(error.message || t("resetPassword.error"));
		} else {
			toast.success(t("resetPassword.success"));
			navigate("/login");
		}
	};

	return (
        <>
		<div className="login-page">
			<div className="login-form-div">
				<form
					onSubmit={handleSubmit(handleResetPassword)}
					className="login-form"
				>
					<h2 className="login-title">{t("resetPassword.title")}</h2>
					<p className="text-center text-sm text-gray-600 mb-4">
						{t("resetPassword.description")}
					</p>

					<div className="form-group">
						<label className="label">
							{t("resetPassword.passwordLabel")}
						</label>
						<input
							type="password"
							{...register("password")}
							className="input"
							placeholder={t("resetPassword.passwordPlaceholder")}
						/>
						{errors.password && (
							<p className="error-message">
								{errors.password.message}
							</p>
						)}
					</div>

					<div className="form-group">
						<label className="label">
							{t("resetPassword.confirmLabel")}
						</label>
						<input
							type="password"
							{...register("confirmPassword")}
							className="input"
							placeholder={t("resetPassword.confirmPlaceholder")}
						/>
						{errors.confirmPassword && (
							<p className="error-message">
								{errors.confirmPassword.message}
							</p>
						)}
					</div>

					<div className="button-container">
						<button type="submit" className="button-submit">
							{t("resetPassword.submit")}
						</button>
					</div>
				</form>
			</div>
		</div>
        <WaveDivider></WaveDivider>
        </>
	);
}
