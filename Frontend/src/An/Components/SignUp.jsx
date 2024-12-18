import { FaGoogle } from "react-icons/fa6";
import "../Css/SignUp.css";
import useSignUpForm from "../Hooks/useSignUpForm";
import { useAuth } from "../../Context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { message, Typography, Tooltip } from "antd";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import { fetchLoginUserData } from "../../services/userService";

function SignUpForm() {
  const navigate = useNavigate();
  const { register, googleAuthUrl, setAuthenticatedUser, setCurrentUser } = useAuth();
  const initialState = {
    name: "",
    email: "",
    password: "",
    confirm_password: "",
  };

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { state, errors, handleChange, handleSubmit } = useSignUpForm(initialState);

  const onSubmit = (e) => {
    setLoading(true);
    register(e.name, e.email, e.password, e.confirm_password)
      .then(async(response) => {
        if (response.status === 200) {
          const { access_token, refresh_token } = response.data.result;
          setAuthenticatedUser(access_token, refresh_token);
          const { data } = await fetchLoginUserData();
        if (data && data.result) {
          setCurrentUser(data.result)
          localStorage.setItem("userInfo", JSON.stringify(data.result))
        }
          navigate(`/profile`, {
            state: { message: "Đăng ký tài khoản thành công. Vui lòng kiểm tra hộp thư email của bạn để xác minh" },
          });
        }
      })
      .catch((error) => {
        const errorObj = error.response.data;
        if (errorObj.errors.password ) {
          message.error(errorObj.errors.password);
          return
        } 
         if (errorObj.errors.email === "Email already exists" ) {
          message.error("Email đã tồn tại");
        }
        console.error("Failed to register", errorObj);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="form-container sign-up-container">
      <form onSubmit={(e) => handleSubmit(onSubmit, e)}>
        <h1>Tạo Tài Khoản</h1>
        <div className="social-container">
          <Tooltip title="Đăng nhập bằng google">
            <Link to={googleAuthUrl} className="social">
              <FaGoogle />
            </Link>
          </Tooltip>
        </div>

        <input
          type="text"
          name="name"
          value={state.name}
          onChange={handleChange}
          placeholder={errors.name ? errors.name : "Tên"}
          className={`input-field ${errors.name ? "error-input" : ""}`}
          disabled={loading}
        />

        <input
          type="email"
          name="email"
          value={state.email}
          onChange={handleChange}
          placeholder={errors.email ? errors.email : "Email"}
          className={`input-field ${errors.email ? "error-input" : ""}`}
          disabled={loading}
        />

       
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={state.password}
            onChange={handleChange}
            placeholder={errors.password ? errors.password : "Mật khẩu"}
            className={`input-field ${errors.password ? "error-input" : ""}`}
            disabled={loading}
          />
          {/* <span
          style={{    transform: 'translate(115px,72px)'
            ,cursor: 'pointer',
            position: 'absolute',
          }}
            onClick={() => setShowPassword(!showPassword)}
            className="toggle-password"
          >
            {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
          </span> */}
      

       
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirm_password"
            value={state.confirm_password}
            onChange={handleChange}
            placeholder={errors.confirm_password ? errors.confirm_password : "Xác nhận Mật khẩu"}
            className={`input-field ${errors.confirm_password ? "error-input" : ""}`}
            disabled={loading}
          />
          {/* <span
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="toggle-password"
            style={{    transform: 'translate(115px,142px)'
              ,cursor: 'pointer',
              position: 'absolute',
            }}
          >
            {showConfirmPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
          </span> */}
      

        <button type="submit" disabled={loading}>
          {loading ? "Đang Đăng Ký..." : "Đăng Ký"}
        </button>
      </form>
    </div>
  );
}

export default SignUpForm;
