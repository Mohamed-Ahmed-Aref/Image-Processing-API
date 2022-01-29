import express, {Request, Response, Application}from 'express';
import logger from './middlewares/logger';
import routes from './routes';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import {getImagesDir} from './utils/fsutils'

const app: Application = express();
const port: number = 3000;

app.use([logger]);

app.use('/api', routes);

app.get(
  '/',
  async (req: Request, res: Response): Promise<void> => {
   const imagesDir : string = await getImagesDir(__dirname);
   const filename: String = req.query.filename as string;
   if (filename){
     const imagePath = path.join (imagesDir, filename + ".jpg");
     if (!fs.existsSync(imagePath)){
       const width : number = parseInt(req.query.width as string);
       const height :number = parseInt(req.query.height as string) ;
       if (!(width || height)){
         res.sendFile(imagePath);
       }
       else if (width && height){
         const image = sharp(imagePath);
         const resizedPath = path.join(imagesDir, "resized", `${filename}.width${width}.height${height}.jpg`);
         if (!fs.existsSync(resizedPath)){
           await image.resize(width , height , {fit: "fill"}).toFile(resizedPath)
         }
         res.sendFile(resizedPath);}
         else if (width){
           const image = sharp(imagePath);
           const resizedPath = path.join(imagesDir, "resized", `${filename}.width${width}.jpg`);
         
         if (!fs.existsSync(resizedPath)){
         await image.metadata().then(async metadata =>{
           await image.resize(width, metadata.height, {fit: "fill"}).toFile(resizedPath)});
                   }
                   res.sendFile(resizedPath);
                  }
                  else{
                    const image = sharp(imagePath);
                    const resizedPath = path.join(imagesDir,"resized", `${filename}.height${height}.jpg`)
                  if (!fs.existsSync(resizedPath)){
                    await image.metadata().then(async metadata =>{
                      await image.resize(metadata.width, height, {fit: 'fill'}).toFile(resizedPath)
                    })
                  }
                  res.sendFile(resizedPath);
                }
              }
              else{
                res.status(400).send(`File ${filename} does not exist`)
              }
            }
            else{
              res.status(400).send (`Required query parameters filename`)
            }
          }
);

export default app;



       

     
  

