import {Routes, Route} from "react-router-dom"
import {Container} from "react-bootstrap"
import Login from "./login/Login.jsx"
import {Provider} from 'react-redux'
import store from './redux/store.js'
import Home from "./components/Home.jsx"
import Repositories from "./components/Repositories.jsx"
import Search from "./searchPages/Search.jsx"

function App() {
  return <Container>
    <Provider store={store}>
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route exact path='/home' element={<Home />} />
        <Route exact path="/:userName/:repoName" element={<Repositories />}>
          <Route path="/:userName/:repoName/:labelName" element={<Repositories />}/> 
        </Route>
        <Route exact path="/search/" element={<Search />}>
          <Route path="/search/:labelName/" element={<Search />} />
        </Route>
      </Routes>
    </Provider>
  </Container>
}

export default App;