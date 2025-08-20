import TopBar from "../components/TopBar";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import "../i18n";

import WaveDivider from "../components/WaveDivider";
import "../styles/WaveDivider.css";
import LoginForm from "../components/LoginForm";
import "../styles/Login.css";


export default function Login() {
    
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
        <>
            <TopBar />
            <div className="login-page">
                <div className="login-form-div">
                <LoginForm />
                </div>
                <WaveDivider />
            </div>
        </>
    );
}
