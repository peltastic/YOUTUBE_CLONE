import "../styles/globals.css";
import { AuthCheckProvider } from "../components/AuthCheck";

function MyApp({ Component, pageProps }) {
  return (
    <AuthCheckProvider>
      <Component {...pageProps} />
    </AuthCheckProvider>
  );
}

export default MyApp;
