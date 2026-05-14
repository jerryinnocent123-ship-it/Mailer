import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

export async function POST(request) {
  console.log('🚀 API rele...');

  let body;
  try {
    body = await request.json();
    console.log('📩 Done resevwa:', body);
  } catch (error) {
    console.error('❌ Erè lekti done:', error);
    return NextResponse.json(
      { error: 'Done ki pa valid.' },
      { status: 400 }
    );
  }

  const { fullName, email } = body;
  
  if (!fullName || !email || !email.includes('@')) {
    console.error('❌ Done manke oswa imèl pa valab');
    return NextResponse.json(
      { error: 'Non konplè ak imèl valab obligatwa.' },
      { status: 400 }
    );
  }

  // Tann 3 segonn
  console.log('⏳ Tann 3 segonn...');
  await new Promise((resolve) => setTimeout(resolve, 3000));

  try {
    // CHEMIN FICHye A — VERIFYE NON FICHye A ISI
    const filePath = path.join(process.cwd(), 'public', 'files', 'Filtrage.xlsx');
    console.log('📂 Chèche fichye nan:', filePath);
    
    // Verifye si fichye a egziste
    if (!fs.existsSync(filePath)) {
      console.error('❌ Fichye pa egziste nan:', filePath);
      return NextResponse.json(
        { error: 'Fichye Excel pa twouve sou sèvè a.' },
        { status: 500 }
      );
    }
    
    console.log('✅ Fichye twouve!');
    const fileContent = fs.readFileSync(filePath);
    console.log('📊 Fichye li, gwosè:', fileContent.length, 'bytes');

    // Verifye si varyab anviwonman yo egziste
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('❌ EMAIL_USER oswa EMAIL_PASS pa konfigire nan .env.local');
      return NextResponse.json(
        { error: 'Konfigirasyon imèl pa konplè.' },
        { status: 500 }
      );
    }

    console.log('📧 Konfigire transpòtè imèl...');
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Verifye koneksyon imèl la
    try {
      await transporter.verify();
      console.log('✅ Koneksyon imèl OK');
    } catch (verifyError) {
      console.error('❌ Koneksyon imèl echwe:', verifyError);
      return NextResponse.json(
        { error: 'Pa ka konekte ak sèvè imèl la. Tcheke EMAIL_USER ak EMAIL_PASS.' },
        { status: 500 }
      );
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: '📎 Men Fichye Excel Ou a',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #007bff;">Bonjou ${fullName}!</h2>
          <p>Men fichye Excel nou pral fe fitraj la.</p>
          <hr/>
          <p style="color: #666;">Mèsi dèske w itilize sèvis nou an! jeyservices</p>
        </div>
      `,
      attachments: [
        {
          filename: 'Filtrage.xlsx',
          content: fileContent,
          contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        },
      ],
    };

    console.log('📨 Voye imèl la...');
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Imèl voye! ID:', info.messageId);
    
    return NextResponse.json({ 
      success: true,
      message: 'Imèl la voye ak siksè!' 
    });

  } catch (error) {
    console.error('💥 ERÈ GLOBAL:', error);
    console.error('💥 Stack:', error.stack);
    return NextResponse.json(
      { error: 'Erè entèn: ' + error.message },
      { status: 500 }
    );
  }
}