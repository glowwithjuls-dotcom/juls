import { NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/auth-helpers';
import { v2 as cloudinary } from 'cloudinary';
import { Buffer } from 'node:buffer';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    return NextResponse.json({ error: 'Cloudinary not configured' }, { status: 500 });
  }
  await requireAdminSession();
  const formData = await request.formData();
  const file = formData.get('file');
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'File missing' }, { status: 400 });
  }
  const buffer = Buffer.from(await file.arrayBuffer());

  const result = await new Promise<any>((resolve, reject) => {
    const upload = cloudinary.uploader.upload_stream(
      { folder: process.env.CLOUDINARY_UPLOAD_FOLDER ?? 'titis-cosmetics' },
      (error, data) => {
        if (error) reject(error);
        else resolve(data);
      },
    );
    upload.end(buffer);
  });

  return NextResponse.json({ url: result.secure_url });
}
