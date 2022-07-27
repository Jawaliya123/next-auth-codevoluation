import {
  getCsrfToken,
  getProviders,
  getSession,
  signIn,
} from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";

export default function SignIn({ csrfToken, providers }: any) {
  const { push } = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<null | string>("");

  const signInUser = async (e: any) => {
    e.preventDefault();
    let options = { redirect: false, email, password };
    const res = await signIn("credentials", options);
    setMessage(null);
    if (res?.error) {
      setMessage(res?.error);
    }
    // console.log("signin => ", res);
    // console.log("signin => ", email, password);
    return push("/");
  };

  const SignUpUser = async (e: any) => {
    e.preventDefault();
    setMessage(null);
    const res = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    let data = await res.json();
    if (data.message) {
      setMessage(data.message);
    }
    if (data.message === "Registered Successfully") {
      let options = { redirect: false, email, password };
      const res = await signIn("credentials", options);
      return push("/");
    }
  };

  return (
    <>
      <form method='post' action='/api/auth/signin/email'>
        <input name='csrfToken' type='hidden' defaultValue={csrfToken} />
        <label>
          Email address
          <input type='email' id='emailval' name='email' />
        </label>
        <button type='submit'>Sign in with Email</button>
      </form>
      <form action=''>
        <label>
          Email address
          <input
            type='email'
            id='email'
            name='email'
            onChange={(e: any) => setEmail(e.target.value)}
            value={email}
          />
        </label>
        <label>
          Password
          <input
            type='password'
            id='password'
            name='password'
            onChange={(e: any) => setPassword(e.target.value)}
            value={password}
          />
        </label>
        <p style={{ color: "red" }}>{message}</p>
        <button onClick={(e: any) => signInUser(e)}>
          Sign In With credentials
        </button>
        <button onClick={(e: any) => SignUpUser(e)}>Sign Up</button>
      </form>
      {Object.values(providers).map((provider: any) => {
        if (provider.name === "Email" || provider.name === "Credentials") {
          return;
        }
        return (
          <div key={provider.name}>
            <button onClick={() => signIn(provider.id)}>
              Sign in with {provider.name}
            </button>
          </div>
        );
      })}
    </>
  );
}

export async function getServerSideProps(context: any) {
  const { req } = context;
  const session = await getSession({ req });
  if (session) {
    // Signed in
    return {
      redirect: { destination: "/" },
    };
  }
  const csrfToken = await getCsrfToken(context);
  const providers = await getProviders();

  return {
    props: { csrfToken, providers },
  };
}
