<script lang="ts">
    import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
    
  let file;
  let form;
  let percent = 0;

  let completeMessage: string | undefined
  
  const handleFileChange = (event: Event & { currentTarget: HTMLInputElement }) => {
    const target = event.target as unknown as { files: File[] }
    const file = target.files[0]

    const formData = new FormData();
    formData.append('file', file)

    let xhr = new XMLHttpRequest()
    xhr.upload.onprogress = function(event) {
        percent = Math.round(100 * event.loaded / event.total);
        // do something with the percentage
    }

    xhr.onreadystatechange = (event) => {
        if (xhr.readyState === 4 && xhr.status < 400) {
            const response = JSON.parse(xhr.responseText)
            completeMessage = `Upload complete! Access your file at http://localhost:5173/${response.id}`
        }
    }

    xhr.open('POST', `${PUBLIC_POCKETBASE_URL}/api/collections/uploads/records`)
    xhr.send(formData)
  }
</script>

<main class="flex flex-col items-center">
  <h1 class="text-4xl font-bold mt-4">KatStash</h1>

  <h2 class="text-2xl font-semibold mt-2">
    Uploads up to 200 MB are allowed. Contact SphericalKat for more details
  </h2>

  {#if completeMessage}
    <h2 class="text-2xl font-semibold mt-2">Upload complete1</h2>
  {/if}

  <form bind:this={form} method="POST">
    <label class="block">
      <span class="sr-only"></span>
      <input
        bind:this={file}
        on:change={handleFileChange}
        type="file"
        id="file"
        class="file:hidden file:px-4 block w-full h-full text-sm text-slate-500"
      />
      {#if percent > 0}
        <div>{percent}%</div>
      {/if}
    </label>
  </form>
</main>
