import axios from "axios"

const SCHEME: string = "https"
const HOST: string = "example.com"
const PORT: number = 443
const PATH: string = "/api"

const BASE_URL = `${SCHEME}://${HOST}:${PORT}${PATH}`

export const axios_ = axios.create({
  baseURL: BASE_URL,
  timeout: 2000,
})

axios_.defaults.headers.common['Authorization'] = 'Bearer '
axios_.defaults.headers.post['Content-Type'] = 'application/json'