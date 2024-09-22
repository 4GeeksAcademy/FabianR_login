import { validate } from "webpack";

const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			user: null,
			token: null,
		},
		actions: {
			singup: async (email, password) => {
				try{ 
					const response = await fetch('/api/signup', {
						method: 'POST',
						headers: {
							'content-Type': 'application/json',
						},
						body: JSON.stringify({email,password}),
					});

					if (response.ok) {
						console.log("Usuario registrado con éxito");
					} else {
						console.log("Error al registrar usuario");
					} 
				} catch (error) {
					console.log("Error de conexión:", error);
				}
			},

			login: async (email, password) => {
				try {
					const response = await fetch ('/api/login', {
						method: 'POST',
						headers: {
							'content-Type': 'application/json',
						},
						body: JSON.stringify({ email, password}),
					});

					if (response.ok) {
						const data = await response.json();
						setStore ({ token: data.token});
						sessionStorage.setItem('token', data.token);
						console.log("Inicio de sesión exitoso");
					} else {
						console.error("Credenciales inválidas");
					}
				} catch (error){
					console.error("Error de conexión:", error);
				}				
			},

			validateToken: async () => {
				const token = sessionStorage.getItem('token');
				if (token) {
					try {
						const response = await fetch('/api/private',{
							methods: 'GET',
							headers: {
								'Autorization':`Bearer ${token}`,
							},
						});

						if (responde.ok) {
							const user = await response.json();
							setStore({user});
							return true;
						} else {
							console.error("Token inválido");
							setStore({token: null, user: null});
							return false;
						}
					} catch (error) {
						console.error("Error de conexión:", error);
						setStore({token: null, user: null });
						return false;
					}
				}
				return false;
			},

			logout: () => {
				setStore({token: null, user: null});
				sessionStorage.removeItem('item');
				console.log("Cierre de sesión exitoso");
			}
		}
	};
};

export default getState;
