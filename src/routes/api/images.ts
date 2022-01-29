import express from 'express';
import { getImage } from '../../utils/fsUtils';
import fs from 'fs';

const images = express.Router();

images.get(
  '/',
  async (req: Request, res: Response): Promise<void> => {
    const query = req.query;
    const { filename, width, height } = query;
    const widthNum = parseInt(width as string);
    const heightNum = parseInt(height as string);
    //query must contain filename to proceed
    if (filename) {
      const imagePath = await getImage(filename as string, widthNum, heightNum);
      if (fs.existsSync(imagePath)) {
        res.sendFile(imagePath);
      } else {
        res.status(400);
        res.send('file name is invalid');
      }
    } else {
      res.status(400);
      res.send('please provide valid filename as a query parameter');
    }
  }
);
export default images;
