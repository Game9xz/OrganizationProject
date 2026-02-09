const Home = () => {
  return (
    <div
      className="home-container"
      style={{ textAlign: "center", padding: "2rem" }}
    >
      <img
        src="/vite.svg"
        alt="Vite logo"
        style={{ width: "120px", marginBottom: "1rem" }}
      />
      <h1>JaonaaySoloLeveling</h1> 
      <p style={{ fontSize: "1.2rem", color: "#888" }}>
        Get started by editing <code>src/components/Home.jsx</code>
      </p>
      <div style={{ marginTop: "2rem" }}>
        <a
          href="https://vitejs.dev"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            margin: "0 1rem",
            color: "#646cff",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          Vite Docs
        </a>
        <a
          href="https://react.dev"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            margin: "0 1rem",
            color: "#61dafb",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          React Docs
        </a>
      </div>
    </div>
  );
};

export default Home;
