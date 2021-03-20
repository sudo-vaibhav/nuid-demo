import Zk from '@nuid/zk'
import { useState } from 'react'
import axios from '../../helpers/axiosForServer'

const decodeJwt = (jwt) => {
  const payloadBase64 = jwt.split('.')[1]
  const json = Buffer.from(payloadBase64, 'base64').toString()
  return JSON.parse(json)
}

const LogIn = () => {
  const [userData, setUserData] = useState({
    email: '',
    password: '',
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log('submitting')
    console.log(userData)
    // const verifiedCredential = Zk.verifiableFromSecret(userData.password)
    const resp = await axios.post('/challenge', {
      email: userData.email,
    })
    const jwt = resp.data.challengeJwt
    const challengeClaims = decodeJwt(jwt)
    const proof = Zk.proofFromSecretAndChallenge(
      userData.password,
      challengeClaims,
    )

    const loginRes = await axios.post('/login', {
      email: userData.email,
      proof: proof,
      challengeJwt: jwt,
    })
    console.log(loginRes.status)

    if (loginRes.status === 201) {
      alert('login successful')
      localStorage.setItem('jwt', loginRes.data.jwt)
      localStorage.setItem('user', JSON.stringify(loginRes.data))
      console.log(loginRes.data)
      window.location.href = '/'
    } else {
      alert('login unsuccessful')
    }
  }

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value })
  }

  return (
    <div className="jumbotron">
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
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
            type="password"
            onChange={handleChange}
          />
        </div>

        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  )
}

export default LogIn
