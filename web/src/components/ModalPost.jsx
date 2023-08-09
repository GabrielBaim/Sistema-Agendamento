import styles from "./ModalPost.module.css";
import { Image, FilmReel, Calendar } from "@phosphor-icons/react";
import { useState, useEffect, useRef } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db, storage } from "../../services/firebaseConfig";
import { addDoc, doc, updateDoc, collection } from "firebase/firestore"; // Importar doc e updateDoc
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ModalPost = ({ handleClose, show, updatePosts, initialPost }) => {
  const [newPost, setNewPost] = useState("");
  const [user, setUser] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewSrc, setPreviewSrc] = useState(null);
  const fileInputRef = useRef(null);

  const [editingPost, setEditingPost] = useState(initialPost);

  useEffect(() => {
    setEditingPost(initialPost);
  }, [initialPost]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewSrc(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedDate) {
      alert("Por favor, selecione uma data para agendar o post.");
      return;
    }

    const storageRef = ref(storage, `posts/${user.uid}/${selectedFile.name}`);

    const uploadTask = uploadBytesResumable(storageRef, selectedFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Você pode usar este código para mostrar uma barra de progresso
      },
      (error) => {
        console.error("Erro no upload:", error);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

        const postToUpdate = {
          content: newPost,
          userId: user.uid,
          timestamp: selectedDate,
          imageUrl: downloadURL,
        };

        if (editingPost) {
          // Atualizar o post existente
          const postRef = doc(db, "posts", editingPost.id);
          await updateDoc(postRef, postToUpdate);
        } else {
          // Adicionar novo post
          const postsCollection = collection(db, "posts");
          await addDoc(postsCollection, postToUpdate);
        }

        setNewPost("");
        setSelectedFile(null);
        setPreviewSrc(null);
        setEditingPost(null);
        handleClose();
        updatePosts();
      }
    );
  };

  const handleAgendarClick = (event) => {
    event.preventDefault();
    setCalendarOpen(!calendarOpen);
  };

  if (!show) {
    return null;
  }

  return (
    <div className={styles.modal}>
      <section className={styles.modalMain}>
        <div className={styles.headModal}>
          <button className={styles.fecharModal} onClick={handleClose}>
            X
          </button>
        </div>
        <form className={styles.formAgendar} onSubmit={handleSubmit}>
          <textarea
            placeholder="Escreva aqui..."
            value={editingPost?.content || newPost}
            onChange={(e) => setNewPost(e.target.value)}
          ></textarea>
          <div className={styles.modalFooter}>
            <div className={styles.featuresModal}>
              <button onClick={handleImageClick}>
                <Image fontSize={32} />
              </button>
              <button>
                <FilmReel size={32} />
              </button>
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              {previewSrc && (
                <img
                  src={previewSrc}
                  alt="Selecionado"
                  className={styles.imageSubmited}
                />
              )}
            </div>
            <div className={styles.Agendar}>
              {calendarOpen && (
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  timeCaption="Hora"
                  dateFormat="MMMM d, yyyy h:mm aa"
                />
              )}
              <button
                className={styles.btnAgendar}
                onClick={handleAgendarClick}
              >
                <Calendar size={32} /> Selecionar Data e Hora
              </button>
              <button type="submit" className={styles.btnAgendar}>
                Agendar
              </button>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
};

export default ModalPost;
