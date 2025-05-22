# Campus Bridge - Platform Booking Skripsi dan Chat App Sebagai Jembatan Mahasiswa

CampusBridge adalah aplikasi mobile berbasis React Native yang dirancang untuk mempermudah proses bimbingan skripsi antara mahasiswa dan dosen. Aplikasi ini dilengkapi dengan fitur chat real-time, video call konsultasi, penjadwalan bimbingan, dan pemantauan progres skripsi secara efisien.

Proyek ini memanfaatkan Stream sebagai infrastruktur utama untuk komunikasi, serta berbagai tools modern untuk membangun UI yang responsif dan performa tinggi.

Manfaat Aplikasi

- Meningkatkan efisiensi komunikasi akademik
- Memudahkan penjadwalan dan dokumentasi bimbingan
- Mendukung pembelajaran jarak jauh secara real-time

Fitur Utama

- Chat real-time antara mahasiswa dan dosen
- Grup chat untuk komunitas mahasiswa
- Histori chat and thread diskusi
- Banyak reaksi dan attachment tambahan di dalam chat
- Indikator terakhir online dan aktivitas chat
- Perekaman sesi video bimbingan dan transkripsi otomatis

Teknologi yang digunakan:

- [Expo Router](https://docs.expo.dev/routing/introduction/) file-based navigation
- [Stream Chat](https://getstream.io/chat/docs/react-native/) untuk chat
- [Stream Video](https://getstream.io/video/docs/react-native/) untuk video call
- [Stream Moderation](https://getstream.io/moderation/docs/) untuk content moderasi
- [NativeWind](https://www.nativewind.dev/) untuk styling
- [Expo Video](https://docs.expo.dev/versions/latest/sdk/video/) untuk video playback
- [Datetime Picker](@react-native-community/datetimepicker) untuk waktu dan tanggal
- [Jotai](https://jotai.pmnd.rs/) untuk state management
- [React Hook Form](https://react-hook-form.com/) for form handling
- [Zod](https://zod.dev/) untuk schema validation
- [React Native Incall Manager](https://github.com/react-native-incall-manager/react-native-incall-manager) untuk audio handling
- [React Native Secure Store](https://github.com/react-native-securestore/react-native-securestore) untuk secure storage

### ⚡ Mulai Membuat Akun Stream

Lanjut buat akun stream terlebih dahulu untuk memulai lebih lanjut

👉 [klik disini untuk lanjut bikin akun stream](https://getstream.io/maker-account/)

---

## Instalasi

### Environment Setup

Pastikan kamu sudah menginstal:

1. Node.js
2. Expo CLI
3. Android Studio dan/atau Xcode (untuk emulator)

### App Setup

Untuk build aplikasi tolong ikuti step ini

1. Clone the repository
2. Run `npm install`
3. Run `npx expo prebuild`
4. Run `npx expo run:ios` atau `npx expo run:android`

## Backend API Setup

Untuk lebih jelasnya baca dokumentasi disini [Backend API Documentation](https://github.com/dimasdekka/CampusBridgeAPI)

1. Clone repo backend: https://github.com/dimasdekka/CampusBridgeAPI
2. Ubah .dummyenv menjadi .env dan isi data sesuai api baru kalian
3. Pastikan frontend (CampusBridge) menggunakan URL backend yang sesuai di .env
4. Run `npm install`
5. Run `npx prisma migrate deploy`
6. Run `npm run seed`
7. Run `npm run build`
8. Run `npm start`

## Langkah Langka Pengujian

Backend:

1. Cek endpoint dengan Postman (register, login, create supervision, dsb).
2. Pastikan response sesuai dan data masuk ke database.

Frontend:

1. Lakukan login/register, cek dashboard, buat jadwal bimbingan, join chat/video call.
2. Pastikan semua fitur berjalan tanpa error.

## Demo

<div style="display: flex; flex-direction: 'row';">
<img src="./screenshots/1.png" width=30%>
<img src="./screenshots/2.png" width=30%>
<img src="./screenshots/3.png" width=30%>
<img src="./screenshots/4.png" width=30%>
<img src="./screenshots/5.png" width=30%>
<img src="./screenshots/6.png" width=30%>
<img src="./screenshots/7.png" width=30%>
<img src="./screenshots/8.png" width=30%>
<img src="./screenshots/9.png" width=30%>
<img src="./screenshots/10.png" width=30%>
<img src="./screenshots/11.png" width=30%>
<img src="./screenshots/12.png" width=30%>
<img src="./screenshots/13.png" width=30%>
<img src="./screenshots/14.png" width=30%>

</div>

## Stream Screenshots

<div style="display: flex; flex-direction: 'row';">
<img src="./screenshots/stream1.png" width=45%>
<img src="./screenshots/stream2.png" width=45%>
<img src="./screenshots/stream3.png" width=45%>
<img src="./screenshots/stream4.png" width=45%>
</div>

## Testing

<div style="display: flex; flex-direction: 'row';">
login testing
<img src="./screenshots/testing1.png" width=45%>
register testing
<img src="./screenshots/testing2.png" width=45%>
create professor testing
<img src="./screenshots/testing3.png" width=45%>
</div>

## 🚀 Lanjutan

Saya dev pengembang ingin membuat sistem mahasiswa bimbingan skripsi menjadi lebih mudah, modern, dan bebas hambatan komunikasi.
