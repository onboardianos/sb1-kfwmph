import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL } from "@ffmpeg/util";
import { MEDIA_URL } from "@services/index";


async function convertWebmToMp4(webmBlob: Blob): Promise<Blob> {
    try {
        const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm'
        const ffmpeg = new FFmpeg();
        await ffmpeg.load({
            coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
            wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
        });

        // Convertir Blob a ArrayBuffer
        const arrayBuffer: ArrayBuffer = await new Response(webmBlob).arrayBuffer();
        // Escribir el ArrayBuffer en el sistema de archivos de FFmpeg
        await ffmpeg.writeFile('input.webm', new Uint8Array(arrayBuffer));
        // Ejecutar el comando de conversión
        await ffmpeg.exec(['-i', 'input.webm', '-c:v', 'libx264', '-c:a', 'aac', 'output.mp4']);
        // Leer el archivo de salida del sistema de archivos de FFmpeg
        const data = await ffmpeg.readFile('output.mp4');
        // Crear un Blob a partir de los datos de salida
        const mp4Blob: Blob = new Blob([data], { type: 'video/mp4' });
        return mp4Blob;
    } catch (e) {
        console.log(e)
        throw new Error('Failed to convert webm to mp4 ' + e);
    }
}


const formatTimeDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60).toFixed(0);
    const remainingSeconds = (seconds % 60).toFixed(0);
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`;
};

const mergeVideos = (testVideos: ITestVideo[], videos: string[], access: string): string[] => {
    let mergedVideos = []
    if (testVideos.length === videos.length) {
        for (let i = 0; i < videos.length; i++) {
            mergedVideos.push(`${MEDIA_URL}/${testVideos[i].location}?${access}`,)
            mergedVideos.push(videos[i])
        }
    } else {
        mergedVideos.push(`${MEDIA_URL}/${testVideos[0].location}?${access}`)
        for (let i = 0; i < videos.length; i++) {
            mergedVideos.push(`${MEDIA_URL}/${testVideos[i + 1].location}?${access}`,)
            mergedVideos.push(videos[i])
        }
    }

    return mergedVideos
}

const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = (error) => reject(error);
        image.src = url;
        image.crossOrigin = 'anonymous'
    });

export const getCroppedImg = async (imageSrc: string, pixelCrop: any): Promise<File> => {
    
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        throw new Error('Failed to get canvas context');
    }

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, pixelCrop.width, pixelCrop.height);

    ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
    );

    return new Promise((resolve, reject) => {
        canvas.toBlob((file) => {
            if (file) {
                resolve(new File([file], 'croppedImage.jpg', { type: 'image/jpeg' }));
            } else {
                reject(new Error('Canvas is empty'));
            }
        }, 'image/jpeg');
    });
};


const Utilities = {
    formatTimeDuration,
    mergeVideos,
    convertWebmToMp4,
    getCroppedImg
}

export default Utilities