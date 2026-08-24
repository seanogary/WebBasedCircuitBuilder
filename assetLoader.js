const loadImage = (path) => {
    return new Promise((resolve, reject) => {
        const image = new Image();

        image.onload = () => resolve(image);
        image.onerror = () => reject();

        image.src = path;
    });
}

let assetPaths = {
    nand: new URL('./assets/NAND.svg', import.meta.url),
}

let assets;
export async function loadAssets() {
    assets = Object.fromEntries(
        await Promise.all(
            Object.entries(assetPaths).map(([key, path]) => 
                loadImage(path).then(image => 
                    [
                        key, 
                        {
                            image: image,
                            connectors: {
                                left: [5, 15],
                                right: [5, 35],
                                output: [95, 25],
                            },
                            center: [image.naturalWidth / 2, image.naturalHeight / 2],
                        }
                    ]
                ).catch(() => [key, null])
            )
            )
    );
}

export { assets };