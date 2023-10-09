import axios from "axios";

const Backend = axios.create({ baseURL: "localhost:4001" });

export default Backend;
