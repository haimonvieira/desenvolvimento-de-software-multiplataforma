const User = () => {
    // Variáveis devem vir antes do "return"
    const name = "Diego";


  return (
    <>
      <div>
        {/* {} : expressões JSX */}
        <p>Olá, {name}</p>
      </div>
    </>
  );
};

export default User;
