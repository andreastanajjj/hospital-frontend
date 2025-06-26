import Header from "./Header"

function Layout({ children }) {
  return (
    <div style={{ minHeight: "100vh", background: "var(--gray-50)" }}>
      <Header />
      <main className="container" style={{ paddingTop: "2rem", paddingBottom: "2rem" }}>
        {children}
      </main>
    </div>
  )
}

export default Layout
