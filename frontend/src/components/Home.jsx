import { Link } from "react-router-dom";

export default function Home() {
    return (
        <div className="home-container">
            <h1>Welcome to My App</h1>
            <p>ระบบจัดการข้อมูลของคุณ</p>

            <div className="home-buttons">
                <Link to="/login">
                    <button className="btn">Login</button>
                </Link>

                <Link to="/register">
                    <button className="btn">Register</button>
                </Link>
            </div>
        </div>
    );
}