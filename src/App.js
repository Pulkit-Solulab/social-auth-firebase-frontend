import './App.css';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut, createUserWithEmailAndPassword, FacebookAuthProvider, TwitterAuthProvider, signInWithCustomToken } from 'firebase/auth';
import { useEffect, useState } from 'react';
import ListOfTodo from './components/ListOfTodo';
import axios from 'axios';

function App() {
  const [auth, setAuth] = useState(false);
  const [token, setToken] = useState('');
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const code = urlParams.get('code')

  useEffect(() => {
    if (code) {
      console.log('code = ', code);
      axios.post('http://localhost:5000/api/v1/auth/insta-exchange-code', {
        code: code,
        ll: 'kk',
      }).then((response) => {
        console.log(response.data);
        const { access_token, user_id, customTokenFirebase } = response.data;
        const auth = getAuth();
        signInWithCustomToken(auth, customTokenFirebase)
          .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            console.log('user yo ', user)
            // ...
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            // ...
          });
      });
    } else {
      onAuthStateChanged(getAuth(), userCred => {
        console.log('authstatechanged', userCred)
        if (userCred) {
          setAuth(true);
          userCred.getIdToken().then(token => {
            console.log('authstatechanged token', token)
            setToken(token);
          });
        }
        else setAuth(false);
      });
    }

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
      console.log('loginWithGoogle', res)
    }).catch(err => {
      console.log(err)
    });
  }

  const loginWithInstagram = () => {
    window.open("https://api.instagram.com/oauth/authorize?client_id=631080548750356&redirect_uri=https://google.com/&scope=user_profile,user_media&response_type=code", "_self");
  }

  const loginWithTwitter = () => {
    const auth = getAuth();
    const provider = new TwitterAuthProvider();
    signInWithPopup(auth, provider).then(res => {
      console.log('loginWithTwitter', res)
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
        <button onClick={loginWithInstagram}>Login Instagram</button>
        <button onClick={loginWithTwitter}>Login Twitter</button>
      </div>}
    </div>
  );
}

export default App;
