import styles from "@/components/Loading/Loading.module.css";

// PROPS: são propriedades enviadas de um componente para o outro
const Loading = ({loading}) => {
  return (
    <>
      <div className={loading ? styles.loading : styles.done }>
        <img src="../../images/loading.gif" alt="Carregando" />
        <p>Carregando...</p>
      </div>
    </>
  );
};

export default Loading;
