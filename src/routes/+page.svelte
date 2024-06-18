<script lang="ts">
  import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
  import { filesize } from 'filesize';

  let file: File | undefined = undefined;
  let percent = 0;
  let isDragging = false;

  let completeURL: string | undefined;

  const handleFormClick = () => {
    if (percent > 0) {
      return;
    }

    let input = document.createElement('input');
    input.type = 'file';
    input.accept = '*';
    input.onchange = (e) => {
      if (input.files) {
        file = input.files[0];
        handleFileChange(file);
      }
    };
    input.click();
  };

  const handleFileChange = (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    let xhr = new XMLHttpRequest();
    xhr.upload.onprogress = function (event) {
      percent = Math.round((100 * event.loaded) / event.total);
      // do something with the percentage
    };

    xhr.onreadystatechange = (event) => {
      if (xhr.readyState === 4 && xhr.status < 400) {
        const response = JSON.parse(xhr.responseText);
        completeURL = `${window.location.origin}/files/${response.id}`;
      }
    };

    xhr.open('POST', `${PUBLIC_POCKETBASE_URL}/api/collections/uploads/records`);
    xhr.send(formData);
  };

  const handleDrop = (
    e: DragEvent & {
      currentTarget: EventTarget & HTMLDivElement;
    }
  ) => {
    e.preventDefault();
    if (e.dataTransfer?.files) {
      file = e.dataTransfer.files[0];
      handleFileChange(file);
    }
  };

  const handleDragEnter = (
    e: DragEvent & {
      currentTarget: EventTarget & HTMLDivElement;
    }
  ) => {
    isDragging = true;
  };

  const handleDragLeave = (
    e: DragEvent & {
      currentTarget: EventTarget & HTMLDivElement;
    }
  ) => {
    isDragging = false;
  };

  const handleDragOver = (
    e: DragEvent & {
      currentTarget: EventTarget & HTMLDivElement;
    }
  ) => {
    e.preventDefault();
  };
</script>

<main class="flex flex-col items-center h-full w-full">
  <h1 class="text-4xl font-bold mt-4">KatStash</h1>

  <h2 class="text-2xl font-semibold mt-2">
    Uploads up to 200 MB are allowed. Contact SphericalKat for more details
  </h2>

  <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div
    on:dragenter={handleDragEnter}
    on:dragleave={handleDragLeave}
    on:drop={handleDrop}
    on:dragover={handleDragOver}
    on:click={handleFormClick}
    class:border-dashed={percent === 0}
    class:cursor-pointer={percent === 0 && !completeURL}
    class="h-48 w-[650px] mt-40 border-2 border-slate-500 rounded-lg flex items-center justify-center cursor-pointer"
  >
    <div class="block">
      {#if percent > 0 && !completeURL}
        <span class="text-slate-500 px-16">Uploading {percent}%</span>
      {:else if percent < 100 && !completeURL}
        <span class="text-slate-500 px-16">Select or drop a file</span>
      {:else}
        <div class="text-slate-500 px-16">
          Upload complete! Access your file at <a class="underline text-blue-500" href={completeURL}
            >{completeURL}</a
          >
        </div>
      {/if}
    </div>
  </div>
</main>
