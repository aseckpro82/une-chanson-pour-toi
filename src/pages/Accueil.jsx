import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function Accueil() {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirection automatique vers la page index
    navigate(createPageUrl("index"), { replace: true });
  }, [navigate]);

  return null;
}