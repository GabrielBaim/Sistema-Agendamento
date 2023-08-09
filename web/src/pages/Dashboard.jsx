import styles from "./Dashboard.module.css";
import { SideBar } from "../components/SideBar";
import { HeaderHome } from "../components/HeaderHome";
import { Agendamentos } from "../components/Agendamentos"; // Importando o componente Agendamentos
import { useState } from "react"; // Importando o hook useState
import { auth } from "../../services/firebaseConfig";
import { useEffect } from "react";

export function Dashboard() {
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        console.log("Usuário está logado:", user);
      } else {
        console.log("Nenhum usuário está logado");
      }
    });

    // Limpar a inscrição quando o componente for desmontado
    return () => unsubscribe();
  }, []);

  const [content, setContent] = useState(
    <Agendamentos className={styles.ContentArea} />
  );

  return (
    <div className={styles.dashboard}>
      <HeaderHome className={styles.HeaderArea} />
      <SideBar className={styles.SideBarArea} />
      <div className={styles.content}>{content}</div>
    </div>
  );
}
