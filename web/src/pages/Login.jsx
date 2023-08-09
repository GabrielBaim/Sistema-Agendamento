import styles from "./Login.module.css";
import { FacebookLogo } from "@phosphor-icons/react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { useState } from "react";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth, db } from "../../services/firebaseConfig";

// Importe as funções do Firestore
import { doc, getDoc } from "firebase/firestore";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState(null);
  const [signInWithEmailAndPassword, loading, error] =
    useSignInWithEmailAndPassword(auth);

  async function handleSignIn(e) {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(email, password);

      if (userCredential.user) {
        // Verifique se o usuário existe no Firestore
        const docRef = doc(db, "users", userCredential.user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          // Se o usuário existir, navegue para o dashboard

          // Aqui, após o sucesso do login no seu app, vamos enviar os dados para o backend que irá usar o Puppeteer.
          const response = await fetch(
            "http://localhost:5000/agendamento/facebook-login",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ email, password }),
            }
          );

          if (response.ok) {
            console.log(
              "Login no Facebook realizado com sucesso via Puppeteer!"
            );
          } else {
            console.error("Erro ao tentar logar no Facebook via Puppeteer.");
          }

          navigate("/dashboard");
        } else {
          // Se o usuário não existir, configure uma mensagem de erro
          setErrorMessage("Usuário não encontrado no Firestore.");
        }
      } else {
        // Quando o login é bem sucedido, mas o usuário ainda é null
        setErrorMessage("Erro desconhecido durante o login.");
      }
    } catch (error) {
      // Trate qualquer erro que ocorra durante o login
      console.error("Erro durante o login:", error);
      if (error.code === "auth/wrong-password") {
        setErrorMessage("Senha incorreta.");
      } else if (error.code === "auth/user-not-found") {
        setErrorMessage("Usuário não encontrado.");
      } else {
        setErrorMessage(error.message);
      }
    }
  }

  // Restante do código ...

  return (
    <div>
      <Header />
      <div className={styles.login}>
        <div className={styles.esquerdo}>
          <img src="../src/assets/login.webp" />
        </div>
        <div className={styles.direito}>
          <h2>FAÇA SEU LOGIN</h2>
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
            <button
              type="submit"
              className={styles.submit}
              onClick={handleSignIn}
            >
              Entrar
            </button>
            <div className={styles.errorSignIn}>
              {" "}
              {errorMessage && <p>{errorMessage}</p>}
            </div>
          </form>
          <div className={styles.final}>
            <p>Ainda não tem uma conta?</p>{" "}
            <Link to="/criarconta"> Cadastre - se</Link>
            <p>Esqueci minha senha</p>
          </div>
        </div>
      </div>
    </div>
  );
}
