import { NextRequest, NextResponse } from 'next/server';
import { getAdminData, upsertAdminData } from '@/lib/db/admin-data';
import { adminDataSchema } from '@/lib/validations/admin-data';
import { ZodError } from 'zod';
import { promises as fs } from 'fs';
import path from 'path';

const jsonFilePath = path.join(process.cwd(), 'data', 'adminData.json');

export async function GET() {
  try {
    // Try to get data from database first
    const data = await getAdminData();
    
    if (data) {
      return NextResponse.json(data);
    }
    
    // Fallback to JSON file if database is empty (for development/migration)
    try {
      const fileContents = await fs.readFile(jsonFilePath, 'utf8');
      const jsonData = JSON.parse(fileContents);
      return NextResponse.json(jsonData);
    } catch (fileError) {
      console.error('No data in database and JSON file read failed:', fileError);
      return NextResponse.json(
        { error: 'No admin data found' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Error reading admin data:', error);
    return NextResponse.json(
      { error: 'Error reading admin data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get the data from the request body
    const newData = await request.json();
    
    // Validate the data using Zod schema
    try {
      const validatedData = adminDataSchema.parse(newData);
      
      // Save to database with validation
      await upsertAdminData(validatedData);
      
      // Also update JSON file for backup/development (optional)
      const updatedFileContents = JSON.stringify(validatedData, null, 2);
      await fs.writeFile(jsonFilePath, updatedFileContents, 'utf8');
      
      return NextResponse.json({
        message: 'Admin data saved successfully',
        success: true,
      });
    } catch (validationError) {
      if (validationError instanceof ZodError) {
        // Return detailed validation errors
        return NextResponse.json(
          {
            error: 'Validation failed',
            details: validationError.issues,
          },
          { status: 400 }
        );
      }
      throw validationError;
    }
  } catch (error) {
    console.error('Error writing admin data:', error);
    return NextResponse.json(
      {
        error: 'Error writing admin data',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
