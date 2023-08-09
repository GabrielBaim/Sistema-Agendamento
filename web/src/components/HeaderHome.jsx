import { useState } from "react";
import styles from "./HeaderHome.module.css";
import { UserCircle, Gear, SignOut } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../services/firebaseConfig";

export function HeaderHome() {
  const [showConfig, setShowConfig] = useState(false);
  const navigate = useNavigate();

  const toggleConfig = (e) => {
    e.preventDefault(); // Prevenir a ação padrão do link
    setShowConfig(!showConfig);
  };

  const signOutUser = (e) => {
    e.preventDefault(); // Prevenir a ação padrão do link

    auth
      .signOut()
      .then(() => {
        // Redirecionar para a página inicial após o logout
        navigate("/");
      })
      .catch((error) => {
        // Tratar erros de logout
        console.error("Erro ao sair:", error);
      });
  };

  return (
    <div className={styles.headerHome}>
      <a href="#" onClick={toggleConfig} className={styles.UserButton}>
        <UserCircle size={32} />
      </a>
      {showConfig && (
        <div className={styles.configAccount}>
          <div className={styles.ConfigOne}>
            <Gear size={32} />
            <span>Configurações</span>
          </div>
          <a href="#" onClick={signOutUser} className={styles.ConfigOne}>
            <div>
              <SignOut size={32} />
              <span>Sair</span>
            </div>
          </a>
        </div>
      )}
    </div>
  );
}
