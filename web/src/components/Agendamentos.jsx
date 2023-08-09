import styles from "./Agendamentos.module.css";
import {
  Image,
  ArrowBendUpRight,
  Pencil,
  Trash,
  Calendar,
  Clock,
  Notepad,
} from "@phosphor-icons/react";
import ModalPost from "./ModalPost";
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../services/firebaseConfig";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  addDoc,
  query,
  where,
} from "firebase/firestore";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export function Agendamentos() {
  const [show, setShow] = useState(false);
  const [posts, setPosts] = useState([]);
  const [editPost, setEditPost] = useState(null);
  const [user, setUser] = useState(null);

  const showModal = () => {
    setShow(true);
  };

  const hideModal = () => {
    setShow(false);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    // Limpe a inscrição ao desmontar
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      fetchPosts();
    }
  }, [user]);

  const fetchPosts = async () => {
    const postsCollection = collection(db, "posts");
    const q = query(postsCollection, where("userId", "==", user.uid));
    const querySnapshot = await getDocs(q);
    const postsList = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setPosts(postsList);
  };

  const addPost = async (newPost) => {
    await addDoc(collection(db, "posts"), {
      content: newPost,
      userId: user.uid,
    });
    fetchPosts(); // Atualizar as postagens após a adição
    hideModal();
  };

  const deletePost = async (postId) => {
    await deleteDoc(doc(db, "posts", postId));
    fetchPosts(); // Atualizar as postagens após a exclusão
  };

  const startEditPost = (post) => {
    setEditPost(post);
    showModal();
  };

  const updatePost = async (postId, updatedPost) => {
    await updateDoc(doc(db, "posts", postId), {
      content: updatedPost,
      userId: user.uid,
    });
    fetchPosts(); // Atualizar as postagens após a edição
    setEditPost(null);
    hideModal();
  };
  return (
    <div className={styles.Agendamentos}>
      <ModalPost
        handleClose={hideModal}
        show={show}
        addPost={editPost === null ? addPost : updatePost}
        initialPost={editPost}
      ></ModalPost>

      <div className={styles.inputDiv} onClick={showModal}>
        <div className={styles.imgPage}>I</div>
        <div className={styles.input}>
          <span>Escreva aqui...</span>
          <Image size={32} />
        </div>
      </div>
      <div className={styles.scrollableContent}>
        <div className={styles.postsFuturos}>
          <ArrowBendUpRight size={32} />
          <h2>Posts Futuros</h2>
          <span>{posts.length}</span> {/* Exibe o número de posts */}
        </div>

        <div className={styles.divider}></div>

        {posts.map((post) => (
          <div className={styles.postDiv} key={post.id}>
            <h3 className={styles.postDate}>
              {format(post.timestamp.toDate(), "PPPP", { locale: ptBR })}
            </h3>
            <div className={styles.postAgendamento}>
              <div className={styles.postInfo}>
                <p className={styles.postDateInfo}>
                  {" "}
                  <Calendar size={20} />
                  {format(post.timestamp.toDate(), "MMM d, yyyy", {
                    locale: ptBR,
                  })}
                </p>
                <p className={styles.postHour}>
                  {" "}
                  <Clock size={20} />
                  {format(post.timestamp.toDate(), "HH:mm", { locale: ptBR })}
                </p>
                <p className={styles.postType}>
                  <Notepad size={20} />
                  Texto
                </p>
              </div>

              <div className={styles.dividerTwo}></div>

              <div className={styles.postContent}>
                <p className={styles.content}>{post.content}</p>
                <div className={styles.ImgContent}>
                  <img src={post.imageUrl}></img>
                </div>
              </div>

              <div className={styles.dividerTwo}></div>

              <div className={styles.postOptions}>
                <button onClick={() => startEditPost(post)}>
                  <Pencil size={24} />
                </button>
                <button onClick={() => deletePost(post.id)}>
                  <Trash size={24} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
