import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import nodemailer from 'nodemailer';
import dbConnect from '@/lib/mongodb';

// --- MODEL DEFINITION ---
const inquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Prevent OverwriteModelError
const Inquiry = mongoose.models.Inquiry || mongoose.model('Inquiry', inquirySchema);

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { name, phone, email, message } = body;

    // Validasi sederhana
    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, message: "Data tidak lengkap!" },
        { status: 400 }
      );
    }

    // A. Simpan ke Database
    const newInquiry = new Inquiry({ name, phone, email, message });
    await newInquiry.save();
    console.log(`💾 Pesan dari ${name} tersimpan di Database.`);

    // B. Kirim Email Notifikasi
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Send to self
      subject: `📩 Pesan Baru: ${name}`,
      html: `
        <h3>Pesan Baru dari Website Pasokari</h3>
        <p><strong>Nama:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Telepon:</strong> ${phone}</p>
        <hr/>
        <p><strong>Pesan:</strong></p>
        <blockquote style="background:#f9f9f9; padding:15px; border-left: 4px solid #00a859;">
          ${message}
        </blockquote>
      `
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log("📧 Email notifikasi berhasil terkirim!");
    } catch (err: unknown) {
      console.error("⚠️ Gagal kirim email:", (err as Error).message);
      // Don't fail the request if email fails, but maybe log it
    }

    return NextResponse.json(
      { success: true, message: "Pesan berhasil disimpan!" },
      { status: 201 }
    );

  } catch (error) {
    console.error("CRITICAL ERROR (Contact):", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan server." },
      { status: 500 }
    );
  }
}
