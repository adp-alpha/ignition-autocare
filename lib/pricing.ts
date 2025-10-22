import path from 'path';
import fs from 'fs/promises';
import { AdminData } from '@/types/adminData';

export const getPricingData = async (): Promise<AdminData> => {
  const filePath = path.join(process.cwd(), 'data', 'adminData.json');
  const jsonData = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(jsonData);
};
