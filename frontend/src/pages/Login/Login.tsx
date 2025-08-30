import { Alert, Form, Input } from "antd";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useErrorHandler } from "../../hooks/useErrorHandler";
import { UserLoginType } from "../../types/userTypes";
import styles from "./Login.module.css";

const Login = () => {
  const authContext = useContext(AuthContext)
  if(!authContext){
   throw new Error()
  }
  const { setAccessToken, setIsAuthenticated, setUser } = authContext;
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const onLogin = async (values:UserLoginType):Promise<void> => {
    try {
      const response = await fetch("http://localhost:3000/api/v1/auth/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      });
      if (!response.ok) throw new Error("Invalid credentials");
      const data = await response.json();
      setAccessToken(data.accessToken);
      setIsAuthenticated(true);
      setUser(data.user);
      navigate("/");
    } catch (err) {
      setError("Invalid email or password");
      console.error(err);
    }
  };

  return (
    <div className={styles.loginWrapper}>
      <h1 className={styles.loginHeader}>Bookshelf</h1>
      {error && <Alert message={error} type="error" showIcon closable />}
      <Form layout="vertical" onFinish={onLogin} autoComplete="off">
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Provide your email" }]}>
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Provide your password" }]}>
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <button
            type="submit"
            name="Login"
            className={styles.loginBtn}>
            Login
          </button>
        </Form.Item>
      </Form>
      <span className={styles.signupInfo}>
        You don't have Bookshelf account yet? Sign up&nbsp;
        <Link role='link' to="/signup">here</Link>
      </span>
    </div>
  );
};

export default Login;
