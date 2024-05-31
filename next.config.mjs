/** @type {import('next').NextConfig} */
const nextConfig = {
     reactStrictMode: true,
     images: {
          domains: ['res.cloudinary.com'], // เพิ่ม hostname ของ Cloudinary ที่นี่
        },
};   

export default nextConfig;
