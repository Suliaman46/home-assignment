import axios from "axios";

export default axios.create(
    {
    baseURL: "https://musicbrainz.org/ws/2",
    headers: {'User-Agent':'Recording Fetcher/0.1 (s_abass@outlook.com)'}
})