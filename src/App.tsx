import { SyntheticEvent, useState } from 'react';
import { useDropzone } from 'react-dropzone';

import { api } from './config';
import { useImages } from './hooks/useImages';

function App() {
  const [files, setFiles] = useState<File[]>([]);
  const [filesProgress, setFilesProgress] = useState<{ [key: number]: number }>({});

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/jpeg': [],
      'image/png': [],
    },
    maxFiles: 10,
    onDrop: (acceptedFiles) => {
      setFiles(acceptedFiles);
    },
  });

  const { data, currentPage, mutate: refetchImages, goToNextPage, goToPrevPage } = useImages();

  const onSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!files || !files.length) return;
    try {
      const filesPromise = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file);
        filesPromise.push(
          api.post('/upload', formData, {
            onUploadProgress: ({ progress }) => {
              setFilesProgress((prev) => ({ ...prev, [i]: progress || 0 }));
            },
          })
        );
      }
      if (filesPromise.length) {
        await Promise.all(filesPromise);
        refetchImages();
        setFiles([]);
        setFilesProgress({});
      }
    } catch (error: unknown) {
      console.log(error);
    }
  };

  const onDelete = async (id: string) => {
    try {
      await api.delete(`/images/${id}`);
      // if only one image on page then go to prev page when image is deleted
      if (currentPage > 1 && data?.data.length === 1) {
        goToPrevPage();
      } else {
        refetchImages();
      }
    } catch (error: unknown) {
      console.log(error);
    }
  };

  return (
    <div className="container">
      {data && data.data.length > 0 && (
        <>
          {data.total > 12 && (
            <div className="images-pagination">
              <button className="button" onClick={goToPrevPage} disabled={currentPage === 1}>
                &laquo;
              </button>
              <button className="button" onClick={goToNextPage} disabled={data.last_page === currentPage}>
                &raquo;
              </button>
            </div>
          )}
          <div className="images">
            {data.data.map((image) => (
              <div className="image-card" key={image.id}>
                <img src={`${image.url}?w=200&h=200&fit=crop`} alt={image.name} />
                <button className="button button--danger" onClick={() => onDelete(image.id)}>
                  x
                </button>
              </div>
            ))}
          </div>
        </>
      )}
      <form onSubmit={onSubmit}>
        <div {...getRootProps({ className: 'dropzone' })}>
          <input {...getInputProps()} />
          <p>Drag 'n' drop some files here, or click to select files</p>
        </div>
        {files.map((file, index) => (
          <div className="file-wrapper" key={index}>
            <p>{file.name}</p>
            <div className="progress-bar-wrapper">
              <div className="progress-bar" style={{ width: `${(filesProgress[index] || 0) * 100}%` }} />
            </div>
          </div>
        ))}
        <button className="button" type="submit" disabled={files.length === 0}>
          Upload file
        </button>
      </form>
    </div>
  );
}

export default App;
