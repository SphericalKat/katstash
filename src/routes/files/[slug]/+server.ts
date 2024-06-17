import { json, redirect } from '@sveltejs/kit';
import Pocketbase from 'pocketbase';
import { PUBLIC_POCKETBASE_URL } from '$env/static/public';

export async function GET({ params: { slug } }) {
  let fileUrl = null;
  try {
    const pocketbase = new Pocketbase(PUBLIC_POCKETBASE_URL);
    const record = await pocketbase.collection('uploads').getOne(slug);
    fileUrl = new URL(
      `${PUBLIC_POCKETBASE_URL}/api/files/${record.collectionId}/${record.id}/${record.file}`
    );
  } catch (error) {
    console.error(error);
    return redirect(307, '/404');
  }

  if (fileUrl) {
    redirect(301, fileUrl);
  }
}
