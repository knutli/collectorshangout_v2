import React from "react";
import { Accordion, AccordionItem } from "@nextui-org/react";
import "../../styles/content.css";

export default function FAQModal() {
  const FAQContent1 =
    "Med Liten Norgespakke tar det 3-5 virkedager før drakten er levert enten i postkassen din, eller nærmeste hentested. Drakten din har også sporing og er forsikret.";
  const FAQContent2 =
    "Dette varierer fra om det er mye aktivitet på nettsiden, og om det er vedlagt nok informasjon med drakten for å verifisere den enkelt.";
  const FAQContent3 =
    "For å minimere svindel krever vi at du lager en konto som knyttes til din identitet. Kun når du er autentisert via Vipps/BankID får du lov å lage egne auksjoner, samt by på auksjoner.";
  const FAQContent4 = "Ja, send oss en epost på xxx@xxx.no";
  const FAQContent5 = "Med glede! Ta kontakt med oss på yyy@xxx.no";
  const FAQContent6 =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";
  const FAQContent7 =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

  return (
    <div className="main-faq-container">
      <div className="all-accordions">
        <Accordion variant="bordered" className="faq-accordion">
          <AccordionItem
            key="1"
            aria-label="Accordion 1"
            title="Hvor lang tid tar det før jeg får drakten(e) jeg bestiller?"
          >
            {FAQContent1}
          </AccordionItem>
          <AccordionItem
            key="2"
            aria-label="Accordion 2"
            title="Hvor lang tid tar det før drakten jeg vil selge er godkjent for publisering?"
          >
            {FAQContent2}
          </AccordionItem>
          <AccordionItem
            key="3"
            aria-label="Accordion 3"
            title="Hvorfor må jeg oppgi personopplysninger for å bli medlem?"
          >
            {FAQContent3}
          </AccordionItem>
          <AccordionItem
            key="4"
            aria-label="Accordion 4"
            title="Finnes det en support-løsning dersom jeg har spørsmål som ikke kan besvares av Q&amp;A?"
          >
            {FAQContent4}
          </AccordionItem>
          <AccordionItem
            key="5"
            aria-label="Accordion 5"
            title="Kan jeg få hjelp til en verdivurdering av (sjelden) trøye før jeg legger den ut på auksjon?"
          >
            {FAQContent5}
          </AccordionItem>
          <AccordionItem
            key="6"
            aria-label="Accordion 3"
            title="Hvorfor må jeg oppgi personopplysninger for å bli medlem? 3"
          >
            {FAQContent6}
          </AccordionItem>
          <AccordionItem
            key="7"
            aria-label="Accordion 3"
            title="Hvorfor må jeg oppgi personopplysninger for å bli medlem? 3"
          >
            {FAQContent7}
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
