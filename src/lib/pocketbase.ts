import Pocketbase from 'pocketbase';
import { PUBLIC_POCKETBASE_URL } from '$env/static/public';

const client = new Pocketbase(PUBLIC_POCKETBASE_URL)
export default client;
