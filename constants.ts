
import { UserRole, DocCategory, Document, ROIStat } from './types';

export const MOCK_DOCUMENTS: Document[] = [
  {
    id: '1',
    title: 'AD/ART HIMA SI 2024',
    category: DocCategory.AD_ART,
    uploader: 'Admin EKRAF',
    date: '2024-01-15',
    summary: 'Anggaran Dasar dan Anggaran Rumah Tangga organisasi HIMA SI.',
    content: 'AD/ART HIMA SI menetapkan visi, misi, dan struktur organisasi. Divisi EKRAF bertugas mengelola dana usaha dan kewirausahaan.'
  },
  {
    id: '2',
    title: 'SOP Pengajuan Sponsor',
    category: DocCategory.SOP_EVENT,
    uploader: 'Adlryan',
    date: '2024-02-10',
    summary: 'Prosedur teknis untuk menghubungi mitra perusahaan.',
    content: 'SOP Sponsor: 1. Pembuatan Proposal, 2. List Target Mitra, 3. Pengiriman Email, 4. Follow Up H+3.'
  },
  {
    id: '3',
    title: 'Laporan Bazaar Kampus 2023',
    category: DocCategory.LAPORAN,
    uploader: 'Marvel',
    date: '2023-12-05',
    summary: 'Evaluasi kegiatan bazaar tahunan.',
    content: 'Bazaar 2023 menghasilkan profit 2jt rupiah. Kendala utama adalah perizinan tempat yang mendadak.'
  }
];

export const ROI_DATA: ROIStat[] = [
  { metric: 'Kecepatan Temu Kembali Informasi', before: '10-15 Menit', after: '< 5 Detik' },
  { metric: 'Ketergantungan pada Pengurus', before: 'Sangat Tinggi', after: 'Rendah (Self-Service)' },
  { metric: 'Struktur Dokumentasi', before: 'Acak / Tersebar', after: 'Terpusat & Terkategori' }
];
