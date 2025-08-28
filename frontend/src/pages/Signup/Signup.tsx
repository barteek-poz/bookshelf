import { Alert, Form, Input } from "antd";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { UserLoginType } from "../../types/userTypes";
import styles from "./Signup.module.css";

const Signup = () => {
  const { setAccessToken, setIsAuthenticated, setUser } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const onSingup = async (values:UserLoginType) => {
    try {
      if (values.password !== values.passwordConfirm) {
        throw new Error("Passwords do not match");
      }
      const response = await fetch("http://localhost:3000/api/v1/auth/signup", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          password: values.password,
          passwordConfirm: values.passwordConfirm,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setAccessToken(data.accessToken);
      setIsAuthenticated(true);
      setUser(data.user);
      navigate("/");
    } catch (err) {
      const catchError = err as Error
      setError(catchError.message);
      console.error(err);
    }
  };

  return (
    <div className={styles.signupWrapper}>
      <h1 className={styles.signupHeader}>Bookshelf</h1>
      {error && <Alert message={error} type="error" showIcon closable />}
      <Form layout="vertical" onFinish={onSingup} autoComplete="off">
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "What's your name?" }]}>
          <Input />
        </Form.Item>
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
        <Form.Item
          label="Password Confirm"
          name="passwordConfirm"
          rules={[{ required: true, message: "Confirm your password" }]}>
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <button
            type="submit"
            name="Signup"
            className={styles.signupBtn}>
            Create account
          </button>
        </Form.Item>
      </Form>
      <span className={styles.loginInfo}>
        You already have Bookshelf account? Login <Link to="/login">here</Link>
      </span>
    </div>
  );
};

export default Signup;
