import styles from "./Login.module.css"
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Alert } from "antd";


const Login = () => {
  const { setAccessToken, setIsAuthenticated, setUser } = useContext(AuthContext);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const response = await fetch("http://localhost:3000/api/v1/auth/login", {
        method: "POST",
        credentials: "include", 
        headers: {
          "Content-Type": "application/json", },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      });

      if (!response.ok) throw new Error("Invalid credentials");

      const data = await response.json();
      setAccessToken(data.accessToken);
      setIsAuthenticated(true);
      setUser(data.user)
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
      <Form
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Provide your email" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Provide your password" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <button type="primary" htmlType="submit" block className={styles.loginBtn}>
            Login
          </button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
