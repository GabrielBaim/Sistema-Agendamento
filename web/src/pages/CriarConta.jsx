import styles from "./CriarConta.module.css";
import { FacebookLogo } from "@phosphor-icons/react";
import { Header } from "../components/Header";

import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth, db } from "../../services/firebaseConfig";

import { useState } from "react";

import { useNavigate } from "react-router-dom";

// Importe as funções do Firestore
import { doc, setDoc } from "firebase/firestore";

export function CriarConta() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [createUserWithEmailAndPassword, user, loading, error] =
    useCreateUserWithEmailAndPassword(auth);

  const navigate = useNavigate();

  function handleSignUp(e) {
    e.preventDefault();
    createUserWithEmailAndPassword(email, password).then((userCredential) => {
      // Adicione o usuário ao Firestore
      const docRef = doc(db, "users", userCredential.user.uid);
      setDoc(docRef, {
        uid: userCredential.user.uid, // Adicione essa linha
        email: userCredential.user.email,
        posts: [],
      }).then(() => {
        navigate("/");
      });
    });
  }
  if (error) {
    return (
      <div>
        <p>Error: {error.message}</p>
      </div>
    );
  }
  if (loading) {
    return <p>Loading...</p>;
  }
  if (user) {
    return (
      <div>
        <p>Registered User: {user.user.email}</p>
      </div>
    );
  }

  //resto do código
  return (
    <div>
      <Header />

      <div className={styles.criarConta}>
        <div className={styles.container}>
          <h2 className={styles.title}>Cadastre - se</h2>
          <button className={styles.faceLogin}>
            <FacebookLogo size={32} /> <span>Entre com o Facebook</span>
          </button>
          <div className={styles.divider}>
            <span className={styles.line}></span>
            <p>Ou entre com </p>
            <span className={styles.line}></span>
          </div>
          <form>
            <input
              type="email"
              required
              placeholder="Seu e-mail"
              onChange={(e) => setEmail(e.target.value)}
            ></input>

            <input
              type="password"
              required
              placeholder="Sua senha"
              onChange={(e) => setPassword(e.target.value)}
            ></input>
            <button className={styles.submit} onClick={handleSignUp}>
              Começar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
