import axios from "axios";
// Serviço de Autenticação

// Função que coleta o token do localstorage do navegador
export const getAxiosConfig = () => ({
  headers: {
    Authorization: `Bearer ${
      typeof window != "undefined" ? (localStorage.getItem("token") ?? "") : ""
    }`,
  },
});

// Função que realiza o login
export const login = async (email, password) => {
  try {
    const response = await axios.post("http://localhost:4000/auth", {
      email,
      password,
    });

    // Armazenando o token devolvido pela API na variável
    const token = response.data.token;
    localStorage.setItem("token", token);
    return { sucess: true };
  } catch (error) {
    return { sucess: false, message: error.message };
  }
};

// Função que realiza logout
export const logout = (router) => {
  localStorage.removeItem("token");
  router.push("/");
};
