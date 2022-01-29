import express, {Request, Response, Application, response}from 'express';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

export const getImagesDir = async (dir: string): Promise<string> => {
  let imagesDir = '';
  const dirContents: string[] = await fs.readdirSync(dir);
  if (dirContents.includes('images')) {
    imagesDir = path.join(dir, 'images');
    return imagesDir;
  } else {
    imagesDir = await getImagesDir(path.join(dir, '..'));
    return imagesDir;
  }
};

const checkPathExists = (path: string): boolean => {
  return fs.existsSync(path);
};

const makeResizeDirIfNotExists = (dir: string): void => {
  if (!checkPathExists(dir)) {
    fs.mkdirSync(dir);
  }
};

const resizeImageWidthToFile = async (
  inPath: string,
  outPath: string,
  width: number
): Promise<void> => {
  const image = sharp(inPath);
  await image.metadata().then(function(metadata) {
    return image
      .resize({
        width,
        height: metadata.height
      })
      .toFile(outPath);
  });
};
const resizeImageHeightToFile = async (
  inPath: string,
  outPath: string,
  height: number
): Promise<void> => {
  const image = sharp(inPath);
  await image.metadata().then(function(metadata) {
    return image
      .resize({
        width: metadata.width,
        height
      })
      .toFile(outPath);
  });
};

const resizeImageWidthAndHeightToFile = async (
  inPath: string,
  outPath: string,
  width: number,
  height: number
): Promise<void> => {
  await sharp(inPath)
    .resize({
      width,
      height
    })
    .toFile(outPath);
};

export const getImage = async (
  filename: string,
  width: number,
  height: number
): Promise<string> => {
  const imagesDir = await getImagesDir(__dirname);
  const originalImage = path.join(imagesDir, 'full', `${filename}.jpg`);
  if (checkPathExists(originalImage)) {
    if (!width && !height) {
      console.log(
        'returning original image as no valid width nor height was specified'
      );
      return originalImage;
    }
    else {
      makeResizeDirIfNotExists(path.join(imagesDir, 'resized'));
      if (width && !height) {
        const imagePath = path.join(
          imagesDir,
          'resized',
          `${filename}-width${width}.jpg`
        );
        if (!checkPathExists(imagePath)) {
          console.log('creating resized image and return its path');
          await resizeImageWidthToFile(originalImage, imagePath, width);
        } else {
          console.log('file already exists,just return its path');
        }
        return imagePath;
      }
      else if (height && !width) {
        const imagePath = path.join(
          imagesDir,
          'resized',
          `${filename}-height${height}.jpg`
        );
        if (!checkPathExists(imagePath)) {
          console.log('creating resized image and return its path');
          await resizeImageHeightToFile(originalImage, imagePath, height);
        } else {
          console.log('file already exists,just return its path');
        }
        return imagePath;
      }
      else {
        const imagePath = path.join(
          imagesDir,
          'resized',
          `${filename}-width${width}-height${height}.jpg`
        );
        if (!checkPathExists(imagePath)) {
          console.log('creating resized image and return its path');
          await resizeImageWidthAndHeightToFile(
            originalImage,
            imagePath,
            width,
            height
          );
        } else {
          console.log('file already exists,just return its path');
        }
        return imagePath;
      }
    }
  } else {
    return 'path does not exist';
  }
};
