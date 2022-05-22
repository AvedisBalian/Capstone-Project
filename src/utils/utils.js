export const Utils = {
  fileToBase64: (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  },
  optimizeImage: (image, maxSize = 400) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = function (event) {
        const scale = maxSize / Math.max(event.target.width, event.target.height);
        const width = event.target.width * scale;
        const height = event.target.height * scale;

        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(img, 0, 0, width, height);

        resolve(canvas.toDataURL());
      };
      img.src = image;
    });
  },
};
