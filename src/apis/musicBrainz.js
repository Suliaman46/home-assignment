import axios from "axios";

export default axios.create(
    {
    baseURL: "https://musicbrainz.org/ws/2"
})