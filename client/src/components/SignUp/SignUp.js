import Zk from '@nuid/zk'
import { useState } from 'react'
import axios from '../../helpers/axiosForServer'

const SignUp = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log('submitting')
    console.log(userData)
    const verifiedCredential = Zk.verifiableFromSecret(userData.password)
    console.log(verifiedCredential)
    const resp = await axios.post('/register', {
      credential: verifiedCredential,
      email: userData.email,
      name: userData.name,
    })

    console.log(resp.data)
  }

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value })
  }

  return (
    <div className="jumbotron">
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <div class="mb-3">
          <label className="form-label">Name</label>
          <input
            className="form-control"
            value={userData.name}
            name="name"
            onChange={handleChange}
          />
        </div>
        <div class="mb-3">
          <label className="form-label">Email</label>
          <input
            className="form-control"
            value={userData.email}
            name="email"
            onChange={handleChange}
          />
        </div>
        <div class="mb-3">
          <label className="form-label">Password</label>
          <input
            className="form-control"
            value={userData.password}
            name="password"
            onChange={handleChange}
            type="password"
          />
        </div>

        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  )
}

export default SignUp
