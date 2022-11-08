import './App.css';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut, FacebookAuthProvider, TwitterAuthProvider } from 'firebase/auth';
import { useEffect, useState } from 'react';
import ListOfTodo from './components/ListOfTodo';

function App() {
  const [auth, setAuth] = useState(false);
  const [token, setToken] = useState('');

  useEffect(() => {
    onAuthStateChanged(getAuth(), userCred => {
      console.log('authstatechanged')
      if (userCred) {
        setAuth(true);
        userCred.getIdToken().then(token => {
          setToken(token);
        });
      }
      else setAuth(false);
    });
  }, []);

  const logout = () => {
    const auth = getAuth();
    signOut(auth).then(() => {
      console.log('signout')
      // Sign-out successful.
    }).catch((error) => {
      console.log(error)
      // An error happened.
    });
  }

  const loginWithGoogle = () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider).then(res => {
      if (res) setAuth(true);
    }).catch(err => {
      console.log(err)
    });
  }

  const loginWithFacebook = () => {
    const auth = getAuth();
    const provider = new FacebookAuthProvider();
    signInWithPopup(auth, provider).then(res => {
      if (res) setAuth(true);
    }).catch(err => {
      console.log(err)
    });
  }

  const loginWithTwitter = () => {
    const auth = getAuth();
    const provider = new TwitterAuthProvider();
    signInWithPopup(auth, provider).then(res => {
      if (res) setAuth(true);
    }).catch(err => {
      console.log(err)
    });
  }

  return (
    <div className="App">
      {auth ? <div>Loged In
        <button onClick={logout}>LogOut</button>
        <ListOfTodo token={token} />
      </div> : <div>
        <button onClick={loginWithGoogle}>Login Google</button>
        <button onClick={loginWithFacebook}>Login Facebook</button>
        <button onClick={loginWithTwitter}>Login Twitter</button>
      </div>}
    </div>
  );
}

export default App;
