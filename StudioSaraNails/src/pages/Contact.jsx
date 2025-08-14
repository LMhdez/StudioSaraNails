import TopBar from "../components/TopBar";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import "../i18n";
import "../styles/Contact.css";
import contactImage from "../assets/contact_image.jpeg";

import WaveDivider from "../components/WaveDivider";
import ContactForm from "../components/ContactForm";

import InstagramIcon from "../assets/InstagramIcon.jsx";
import WhatsAppIcon from "../assets/WhatsAppIcon.jsx";
import EmailIcon from "../assets/EmailIcon.jsx";

export default function Contact() {
	const { t } = useTranslation();
	const title = t("contact.title");

	const words = title.split(" ");
	const lastWord = words.pop();
	const rest = words.join(" ");
	const instagramLink = "https://www.instagram.com/studiosaranails/";
	const whatsAppLink = "https://wa.me/584122892549";
	const email = "soe18.sara@gmail.com";
	const handleContactSubmit = () => {
		window.location.href = "mailto:soe18.sara@gmail.com";
	};
	return (
		<>
			<TopBar />
			<div className="contact-page">
				<div className="contact-main">
					<div className="contact-left-div">
						<div className="contact-title-div">
							<h2>
								{rest}{" "}
								<span className="highlight">{lastWord}</span>
							</h2>
						</div>
						<div className="contact-form-div">
							<ContactForm
								onSubmit={handleContactSubmit}
							></ContactForm>
						</div>
					</div>
					<div className="contact-right-div">
						<div className="svg-container">
							<svg viewBox="0 0 300 300" width="300" height="300">
								<defs>
									<path
										id="circlePath"
										d="
                                M 150, 150
                                m -100, 0
                                a 100,100 0 1,1 200,0
                                a 100,100 0 1,1 -200,0
                                "
									/>
								</defs>
								<text fontSize="14" fill="#a688a5">
									<textPath
										href="#circlePath"
										startOffset="0"
									>
										{Array(10)
											.fill(
												t("contact.roundText") + " • "
											)
											.join("")}
									</textPath>
								</text>
							</svg>
						</div>

						<img src={contactImage} alt="Contact" />
					</div>
				</div>

				<div className="contact-social-media">
					<div className="social-icons">
						<a
							href={instagramLink}
							target="_blank"
							rel="noopener noreferrer"
						>
							<InstagramIcon />
							Instagram
						</a>
						<a
							href={whatsAppLink}
							target="_blank"
							rel="noopener noreferrer"
						>
							<WhatsAppIcon />
							WhatsApp
						</a>
						<a
							href={`mailto:${email}`}
							target="_blank"
							rel="noopener noreferrer"
						>
							<EmailIcon />
							Email
						</a>
					</div>
					<div className="contact-info">
						<p>{t("contact.email")}</p>
						<p>{email}</p>
						<p>{t("email.label_phone")}</p>
						<p>{`+${whatsAppLink.replace(
							"https://wa.me/",
							""
						)}`}</p>
					</div>
				</div>
				<WaveDivider />
			</div>
		</>
	);
}
