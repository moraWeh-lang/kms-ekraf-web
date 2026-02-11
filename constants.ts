
import { UserRole, DocCategory, Document } from './types';

export const MOCK_DOCUMENTS: Document[] = [
  {
    id: '1',
    title: 'AD/ART HIMA SI 2024',
    category: DocCategory.AD_ART,
    uploader: 'Admin EKRAF',
    date: '2024-01-15',
    summary: 'Anggaran Dasar dan Anggaran Rumah Tangga organisasi HIMA SI.',
    content: 'AD/ART HIMA SI menetapkan visi, misi, dan struktur organisasi. Divisi EKRAF bertugas mengelola dana usaha dan kewirausahaan.',
    views: 145
  },
  {
    id: '2',
    title: 'SOP Pengajuan Sponsor',
    category: DocCategory.SOP_EVENT,
    uploader: 'Adlryan',
    date: '2024-02-10',
    summary: 'Prosedur teknis untuk menghubungi mitra perusahaan.',
    content: 'SOP Sponsor: 1. Pembuatan Proposal, 2. List Target Mitra, 3. Pengiriman Email, 4. Follow Up H+3.',
    views: 89
  },
  {
    id: '3',
    title: 'Laporan Bazaar Kampus 2023',
    category: DocCategory.LAPORAN,
    uploader: 'Marvel',
    date: '2023-12-05',
    summary: 'Evaluasi kegiatan bazaar tahunan.',
    content: 'Bazaar 2023 menghasilkan profit 2jt rupiah. Kendala utama adalah perizinan tempat yang mendadak.',
    views: 34
  },
  {
    id: '4',
    title: 'Best Practice Content Creator',
    category: DocCategory.BEST_PRACTICE,
    uploader: 'Zahra',
    date: '2024-03-01',
    summary: 'Panduan pembuatan konten kreatif untuk Instagram.',
    content: 'Konten harus memiliki hook 3 detik pertama. Gunakan palet warna HIMA SI: Biru Muda dan Putih.',
    views: 210
  }
];

export const USAGE_STATS = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Apr', value: 800 },
  { name: 'Mei', value: 500 },
];

export const POPULAR_TOPICS = [
  { name: 'SOP Sponsor', value: 45 },
  { name: 'AD/ART', value: 25 },
  { name: 'Bazaar', value: 15 },
  { name: 'Content', value: 15 },
];
